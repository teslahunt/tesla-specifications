'use strict'

const test = require('ava')

const { MODEL_S, MODEL_X, MODEL_Y, MODEL_3 } = require('tesla-title')

const teslaSpec = require('../')

const cars = [].concat(
  Object.keys(MODEL_S),
  Object.keys(MODEL_X),
  Object.keys(MODEL_Y),
  Object.keys(MODEL_3)
)

const omit = ['Model S Plaid+']

cars.forEach(car => {
  if (!omit.includes(car)) {
    test(car, t => {
      t.true(!!teslaSpec[car])
    })
  }
})
