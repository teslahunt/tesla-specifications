const lodash = require('lodash')

const json = require('../src/index.json')

const { WLTPtoEPA } = require('./util')

lodash.forEach(json, value => {
  lodash.forEach(value, (value, key) => {
    // fix wltp
    // {
    //   const wltp = Number(value.rangeWLTP.replace('km', ''))
    //   value.rangeWLTP = `${wltp} km`
    // }
    // // fix topspeed
    // {
    //   const topSpeed = Number(value.topSpeed.replace('km/h', ''))
    //   value.topSpeed = `${topSpeed} km/h`
    // }

    const wltp = Number(value.rangeWLTP.split(' ')[0])
    const epa = WLTPtoEPA(wltp)

    const expected = Number(value.rangeEPA.split(' ')[0])

    if (expected !== epa) {
      value.rangeEPA = `${epa} mi`
    }
  })
})

require('fs').writeFileSync(
  './src/index.json',
  JSON.stringify(json, null, 2),
  'utf8'
)
