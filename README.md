<div align="center">
  <img src="https://teslahunt.io/banner-red.png">
  <br><br>
</div>

![Last version](https://img.shields.io/github/tag/teslahunt/tesla-specifications.svg?style=flat-square)
[![Coverage Status](https://img.shields.io/coveralls/teslahunt/tesla-specifications.svg?style=flat-square)](https://coveralls.io/github/teslahunt/tesla-specifications)
[![NPM Status](https://img.shields.io/npm/dm/tesla-specifications.svg?style=flat-square)](https://www.npmjs.org/package/tesla-specifications)

> Detailed technical information related to Tesla vehicles.

The information is collected from:

- [evcompare.io](https://evcompare.io)
- [evspecifications.com](https://www.evspecifications.com)
- [teslike.com](https://teslike.com)

## Install

```bash
$ npm install tesla-specifications --save
```

## Usage

```js
const teslaSpec = require('tesla-specifications')

console.log(teslaSpec[0])

// "Model 3 Long Range AWD": {
//   "acceleration": "4.6 secs",
//   "batteryPack": "75 kWh",
//   "curbWeight": "1847 kg",
//   "dimensions": "4694 x 1850 x 1443",
//   "efficiency": "13.4 kWh / 100 km",
//   "enginePower": "346 hp",
//   "engineTorque": "527 Nm",
//   "range": "518 km",
//   "topSpeed": "225 km/h",
//   "wheelBase": "2875 mm"
// }
```

## License

**tesla-specifications** © [Tesla Hunt](https://teslahunt.io), released under the [MIT](https://github.com/teslahunt/tesla-specifications/blob/master/LICENSE.md) License.<br>
Authored and maintained by [Tesla Hunt](https://teslahunt.io) with help from [contributors](https://github.com/teslahunt/tesla-specifications/contributors).

> [teslahunt.io](https://teslahunt.io) · GitHub [Tesla Hunt](https://github.com/teslahunt) · Twitter [@teslahunt](https://twitter.com/teslahunt)
