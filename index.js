import { aggregation } from './src/utils.js'
import SOTKLogin from './src/login.js'
import SOTKCardsList from './src/cardsList.js'
import nodefetch, { Headers } from 'node-fetch'
import _ from 'lodash'
import cookie from 'cookie'
import { parse } from 'node-html-parser'

class SOTKBase {
  constructor() {
    this.credentials = {}
  }

  fetch(url, options = {}) {
    const headers = new Headers(options.headers)
    headers.set('cookie', cookie.serialize('fb60ded04faae990cc1fc4ed1921fc75', this.credentials.token))
    // DO NOT USE SET-COOKIE: https://stackoverflow.com/a/35258629/13689893
    options.headers = headers
    return nodefetch(url, options)
  }

  async getAccountInfo() {
    const response = await this.fetch('https://s-otk.ru/index.php/passengerlk')
    const accountInfo = await response.text()
    const root = parse(accountInfo)
    const balanceForm = root.querySelector('form#getbalance')
    const balance = {
      token: balanceForm.querySelector('#balance_token').getAttribute('name'),
      pid: balanceForm.querySelector('#balance_pid').getAttribute('name'),
    }

    return { balance }
  }
}

export default class SOTK extends aggregation(
  SOTKBase,
  SOTKLogin,
  SOTKCardsList
) { }