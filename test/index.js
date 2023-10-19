'use strict'

const test = require('ava')

const { MODEL_S, MODEL_X, MODEL_Y, MODEL_3 } = require('tesla-title')

const teslaSpec = require('../')

const cars = [
  ['Model S', MODEL_S],
  ['Model 3', MODEL_3],
  ['Model X', MODEL_X],
  ['Model Y', MODEL_Y]
].reduce((acc, [baseTitle, data]) => {
  const titles = Array.from(new Map(data).keys()).map(model => `${baseTitle} ${model}`.trim())
  acc = acc.concat(titles)
  return acc
}, [])

const omit = ['Model S Plaid+']

cars.forEach(car => {
  if (!omit.includes(car)) {
    test(car, t => {
      t.true(!!teslaSpec[car])
    })
  }
})
