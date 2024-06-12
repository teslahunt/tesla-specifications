'use strict'

const test = require('ava')

const teslaSpecs = require('../')

test('add extra fields', t => {
  const specs = teslaSpecs({ optionCodes: ['MT303'], modelLetter: '3' })
  t.snapshot(specs)
})
