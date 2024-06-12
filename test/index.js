'use strict'

const test = require('ava')

const teslaSpecs = require('../')

test("return undefined if chassis doesn't exist", t => {
  const specs = teslaSpecs({ optionCodes: ['MT303'], modelLetter: 'T' })
  t.is(specs, undefined)
})

test('add extra fields', t => {
  const specs = teslaSpecs({ optionCodes: ['MT303'], modelLetter: '3' })
  t.snapshot(specs)
})
