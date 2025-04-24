'use strict'

const debug = require('debug-logfmt')('tesla-specifications')
const inventories = require('tesla-inventory/inventories')
const { writeFileSync } = require('fs')
const parseNum = require('parse-num')
const path = require('path')

const {
  EPAtoWLTP,
  fetcher,
  milesToKm,
  sortObjectByKey,
  normalizeUnit,
  WLTPtoEPA
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
const DATA = require('../src/index.json')

const processResults = (inventoryCode, results) => {
  for (const item of results) {
    const { OptionCodeData, VIN: vin } = item
    const specData = OptionCodeData.filter(data =>
      data.group.startsWith('SPEC')
    )
    const wheels = getWheels(OptionCodeData)
    const chassis = specData[0].code.slice(1)

    const spec = {
      acceleration: normalizeUnit(getSpec('SPECS_ACCELERATION', specData)),
      topSpeed: normalizeUnit(getSpec('SPECS_TOP_SPEED', specData)),
      rangeWLTP: normalizeUnit(rangeWLTP('SPECS_RANGE', specData))
    }

    spec.rangeEPA = `${WLTPtoEPA(parseNum(spec.rangeWLTP))} mi`

    debug(chassis, inventoryCode, spec)

    const updateSpec = spec => {
      if (DATA[chassis] === undefined) {
        DATA[chassis] = {}
        DATA[chassis][wheels] = spec
      } else {
        const previousSpec = DATA[chassis][wheels]
        const previousAcceleration = Number(
          previousSpec.acceleration.split(' ')[0]
        )
        const aceleration = Number(spec.acceleration.split(' ')[0])

        if (previousAcceleration > aceleration) {
          debug('found mismatching acceleration', chassis, inventoryCode, vin, {
            previous: JSON.stringify(DATA[chassis][wheels]),
            new: JSON.stringify(spec)
          })
          DATA[chassis][wheels] = spec
        }

        if (parseNum(previousSpec.acceleration) < parseNum(spec.acceleration)) {
          debug('skipped', { vin, chassis }, spec)
        }
      }
    }

    if (spec.topSpeed.includes('km/h') && spec.acceleration.endsWith('s')) {
      updateSpec(spec)
    } else if (spec.topSpeed.includes('mph')) {
      updateSpec({
        ...spec,
        acceleration: spec.acceleration.replace('sec', 's'),
        topSpeed: `${milesToKm(parseNum(spec.topSpeed))} km/h`,
        rangeWLTP: `${milesToKm(parseNum(spec.rangeWLTP))} km`
      })
    } else {
      debug('skipped', { vin, chassis }, spec)
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
          processResults(inventoryCode, results)
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
