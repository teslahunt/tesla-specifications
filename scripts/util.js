'use strict'

const createBrowser = require('browserless')
const { onExit } = require('signal-exit')
const { chain } = require('lodash')

const browser = () =>
  Promise.resolve(
    this.instance ||
      (this.instance = (() => {
        const browser = createBrowser({ puppeteer: require('puppeteer') })
        onExit(browser.close)
        return browser
      })())
  ).then(browser => browser.createContext())

const fetcher = async url => {
  const browserless = await browser()

  const fn = browserless.evaluate(
    async (_, response, error) => {
      if (error) throw error
      const status = response.status()
      if (response.status() !== 200) {
        throw new TypeError(`Response status: ${status}`)
      }
      return response.text()
    },
    {
      abortTypes: ['image', 'stylesheet', 'font', 'other'],
      adblock: false,
      waitUntil: 'networkidle0',
      animations: true
    }
  )

  const result = await fn(url)
  await browserless.destroyContext()
  return result
}

const sortObjectByKey = obj =>
  chain(obj).toPairs().sortBy(0).fromPairs().value()

const milesToKm = miles => Math.round(miles * 1.60934)

/**
 * turn kms into WLTP range
 * https://ev-range-standard-converter.web.app/
 */
const EPAtoWLTP = kms => Math.round(kms * 1.168)

/**
 * turn kms into miles for EPA range
 * https://ev-range-standard-converter.web.app/
 */
const WLTPtoEPA = kms => Math.round(kms / 1.168)

const normalizeUnit = str =>
  str
    .replace('公里/小時', 'km/h') // tw
    .replace('公里/小时', 'km/h') // cn
    .replace('กม./ชม.', 'km/h') // th
    .replace('km/u', 'km/h') // be
    .replace('km/klst', 'km/h') // is
    .replace('km/t', 'km/h') // dk
    .replace('km/s', 'km/h') // sn
    .replace('χλμ/ώρα', 'km/h') // gr
    .replace('קמ״ש', 'km/h') // il
    .replace('公里', 'km') // cn
    .replace('กม', 'km') // th
    .replace('ק״מ', 'km') // il
    .replace('χλμ', 'km') // gr
    .replace('δευτ.', 's') // gr
    .replace('วินาที', 's') // th
    .replace('sn', 's') // tr
    .replace('sec', 's') // bg
    .replace('שנ', 's') // il
    .replace('秒', 's') // cn
    .replace('Sek.', 's') // at
    .replace(/(\d+)([a-zA-Z/])/, '$1 $2')

module.exports = {
  fetcher,
  sortObjectByKey,
  milesToKm,
  EPAtoWLTP,
  WLTPtoEPA,
  normalizeUnit
}
