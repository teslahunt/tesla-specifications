'use strict'

const test = require('ava')

const { milesToKm, normalizeUnit } = require('../scripts/util')

test('normalize units for range WLTP unit', t => {
  t.is(normalizeUnit('593公里'), '593 km')
  t.is(normalizeUnit('593กม'), '593 km')
  t.is(normalizeUnit('593χλμ'), '593 km')
  t.is(normalizeUnit('593ק״מ'), '593 km')
})

test('normalize units for aceleratio', t => {
  t.is(normalizeUnit('5.9秒'), '5.9 s')
  t.is(normalizeUnit('5.9วินาที'), '5.9 s')
  t.is(normalizeUnit('5.9Sek.'), '5.9 s')
  t.is(normalizeUnit('5.9sec'), '5.9 s')
  t.is(normalizeUnit('5.9sn'), '5.9 s')
  t.is(normalizeUnit('5.9שנ'), '5.9 s')
})

test('normalize units top speed', t => {
  t.is(normalizeUnit('201公里/小时'), '201 km/h')
  t.is(normalizeUnit('201公里/小時'), '201 km/h')
  t.is(normalizeUnit('201กม./ชม.'), '201 km/h')
  t.is(normalizeUnit('201km/u'), '201 km/h')
  t.is(normalizeUnit('201km/t'), '201 km/h')
  t.is(normalizeUnit('201km/s'), '201 km/h')
  t.is(normalizeUnit('201km/klst'), '201 km/h')
  t.is(normalizeUnit('201χλμ/ώρα'), '201 km/h')
})

test('turn from mph to km/h', t => {
  t.is(milesToKm(135), 217)
})
