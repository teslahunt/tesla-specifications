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

// https://evdb.nz/wltp
const EPAtoWLTP = range => Math.round(range * 1.88)

const unitSpace = str => str.replace(/(\d+)([a-zA-Z/])/, '$1 $2')

module.exports = { fetcher, sortObjectByKey, milesToKm, EPAtoWLTP, unitSpace }
