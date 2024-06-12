'use strict'

const debug = require('debug-logfmt')('tesla-specifications')
const inventories = require('tesla-inventory/inventories')
const { writeFileSync } = require('fs')
const parseNum = require('parse-num')
const path = require('path')

const {
  sortObjectByKey,
  milesToKm,
  fetcher,
  EPAtoWLTP,
  unitSpace
} = require('./util')

const teslaInventory = require('tesla-inventory')(fetcher)

const getSpec = (group, specs) => {
  const item = specs.find(spec => spec.group === group)
  return `${item.value}${item.unit_short}`
}

const rangeWLTP = (group, specs) => {
  let {
    value,
    range_source: rangeSource,
    unit_short: unit
  } = specs.find(spec => spec.group === group)
  if (rangeSource === 'EPA') value = EPAtoWLTP(value)
  return `${value}${unit}`
}

const getWheels = OptionCodeData => {
  const { name } = OptionCodeData.find(data => data.group === 'WHEELS')
  const wheels = parseNum(name)
  if (!Number.isNaN(wheels)) return wheels
  console.log(OptionCodeData)
  throw new Error('no wheels detected')
}

const MODEL_LETTER = ['s', '3', 'x', 'y']
const MODEL_CONDITION = ['used', 'new']
const DATA = require('..')

const processResults = results => {
  for (const item of results) {
    const { OptionCodeData, VIN: vin } = item
    const specData = OptionCodeData.filter(data =>
      data.group.startsWith('SPEC')
    )
    const wheels = getWheels(OptionCodeData)
    const chasis = specData[0].code.slice(1)

    const spec = {
      acceleration: getSpec('SPECS_ACCELERATION', specData),
      topSpeed: getSpec('SPECS_TOP_SPEED', specData),
      rangeWLTP: rangeWLTP('SPECS_RANGE', specData)
    }

    if (DATA[chasis] === undefined) DATA[chasis] = {}
    if (DATA[chasis][wheels]) continue

    const updateSpec = spec => {
      spec.acceleration = unitSpace(spec.acceleration)
      spec.topSpeed = unitSpace(spec.topSpeed)
      spec.rangeWLTP = unitSpace(spec.rangeWLTP)
      DATA[chasis][wheels] = spec
    }

    if (spec.topSpeed.includes('km/h') && spec.acceleration.endsWith('s')) {
      updateSpec(spec)
    } else if (spec.acceleration.endsWith('Sek.')) {
      updateSpec({
        ...spec,
        acceleration: spec.acceleration.replace('Sek.', 's')
      })
    } else if (spec.topSpeed.endsWith('km/u')) {
      updateSpec({
        ...spec,
        topSpeed: spec.topSpeed.replace('km/u', 'km/h')
      })
    } else if (spec.topSpeed.includes('mph')) {
      updateSpec({
        ...spec,
        acceleration: spec.acceleration.replace('sec', 's'),
        topSpeed: `${milesToKm(parseNum(spec.topSpeed))}km/h`,
        rangeWLTP: `${milesToKm(parseNum(spec.rangeWLTP))}km`
      })
    } else {
      debug('skipped', { vin, chasis }, spec)
      continue
    }
  }
}

const main = async inventories => {
  for (const [inventoryCode] of Object.entries(inventories)) {
    for (const model of MODEL_LETTER) {
      for (const condition of MODEL_CONDITION) {
        try {
          const results = await teslaInventory(inventoryCode, {
            model,
            condition
          })
          processResults(results)
        } catch (error) {
          debug.error(error.message || error, {
            inventoryCode,
            model,
            condition
          })
        }
      }
    }

    writeFileSync(
      path.resolve(__dirname, '../src/index.json'),
      JSON.stringify(sortObjectByKey(DATA), null, 2)
    )
  }
}

main(inventories).then(process.exit)
