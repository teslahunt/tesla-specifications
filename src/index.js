'use strict'

const teslaSpecs = require('./index.json')

const EXTRA = {
  // https://www.tesla.com/ownersmanual/model3/en_us
  3: {
    curbWeight: '1704 kg',
    dimensions: '4720 mm L x 1850 mm W x 1441 mm H',
    wheelbase: '2875 mm',
    dragCoefficient: '0.219 Cd'
  },
  // https://www.tesla.com/ownersmanual/models/en_us/
  S: {
    curbWeight: '2109 kg',
    dimensions: '5021 mm L x 1987 mm W x 1431 mm H',
    wheelbase: '2960 mm',
    dragCoefficient: '0.208 Cd'
  },
  // https://www.tesla.com/ownersmanual/modelx/en_us
  X: {
    curbWeight: '2352 kg',
    dimensions: '5057 x 1999 x 1680',
    wheelbase: '2965 mm',
    dragCoefficient: '0.24 Cd'
  },
  // https://www.tesla.com/ownersmanual/modely/en_us
  Y: {
    curbWeight: '2008 kg',
    dimensions: '4751 mm L x 1921 mm W x 1624 mm H',
    wheelbase: '2890 mm',
    dragCoefficient: '0.23 Cd'
  }
}

module.exports = ({ optionCodes, modelLetter }) => {
  const chasis = optionCodes.find(code => code.startsWith(`MT${modelLetter}`))
  const specs = teslaSpecs[chasis]
  return {
    ...specs[Object.keys(specs)[0]],
    ...EXTRA[modelLetter]
  }
}
