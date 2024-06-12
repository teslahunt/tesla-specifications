<div align="center">
  <img src="https://teslahunt.io/banner-red.png">
  <br><br>
</div>

![Last version](https://img.shields.io/github/tag/teslahunt/tesla-specifications.svg?style=flat-square)
[![Coverage Status](https://img.shields.io/coveralls/teslahunt/tesla-specifications.svg?style=flat-square)](https://coveralls.io/github/teslahunt/tesla-specifications)
[![NPM Status](https://img.shields.io/npm/dm/tesla-specifications.svg?style=flat-square)](https://www.npmjs.org/package/tesla-specifications)

> Detailed technical information related to Tesla vehicles.

All the specifications are normalized into:

- acceleration: 0-100 km/h in seconds.
- top speed: km/h.
- range: kms in WLTP cycle.

## Install

```bash
$ npm install tesla-specifications --save
```

## Usage

The data is based in Tesla official numbers taking into the chassis and the wheel size:

```js
const teslaSpecs = require('tesla-specifications')

const specs = teslaSpecs({ optionCodes: ['MT303'], modelLetter: '3' })

console.log(specs)
// {
//   acceleration: '4.6 s',
//   curbWeight: '1704 kg',
//   dimensions: '4720 mm L x 1850 mm W x 1441 mm H',
//   dragCoefficient: '0.219 Cd',
//   rangeWLTP: '560 km',
//   topSpeed: '233 km/h',
//   wheelbase: '2875 mm',
// }
```

## License

**tesla-specifications** © [Tesla Hunt](https://teslahunt.io), Released under the [MIT](https://github.com/teslahunt/specifications/blob/master/LICENSE.md) License.<br>
Authored and maintained by [Tesla Hunt](https://teslahunt.io) with help from [contributors](https://github.com/teslahunt/specifications/contributors).

> [teslahunt.io](https://teslahunt.io) · GitHub [teslahunt](https://github.com/teslahunt) · Twitter [@teslahuntio](https://twitter.com/teslahuntio)
