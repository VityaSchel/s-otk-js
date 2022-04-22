import { aggregation } from './src/utils.js'
import SOTKLogin from './src/login.js'
import SOTKCardsList from './src/cardsList.js'
import SOTKHistory from './src/history.js'
import nodefetch, { Headers } from 'node-fetch'
import cookie from 'cookie'
import { parse } from 'node-html-parser'

class SOTKBase {
  constructor() {
    this.credentials = {}
  }

  fetch(url, options = {}) {
    const headers = new Headers(options.headers)
    headers.set('cookie', [
      cookie.serialize('fb60ded04faae990cc1fc4ed1921fc75', this.credentials.token)
    ].join('; '))
    // DO NOT USE SET-COOKIE: https://stackoverflow.com/a/35258629/13689893
    options.headers = headers
    return nodefetch(url, options)
  }

  async getAccountInfo(useCache = false) {
    if (this.accountInfo && useCache) return this.accountInfo

    const response = await this.fetch('https://s-otk.ru/index.php/passengerlk')
    const accountInfo = await response.text()
    const root = parse(accountInfo)

    const balanceForm = root.querySelector('form#getbalance')
    const balance = {
      token: balanceForm.querySelector('#balance_token').getAttribute('name'),
      pid: balanceForm.querySelector('#balance_pid').getAttribute('name'),
    }

    const delCardForm = root.querySelector('form#carddel')
    const delCard = {
      token: delCardForm.querySelector('#token_del').getAttribute('name'),
      pid: delCardForm.querySelector('#pid_del').getAttribute('name'),
    }

    const cardAddForm = root.querySelector('form#numtype')
    const addCard = {
      token: cardAddForm.querySelector('#token').getAttribute('name'),
      pid: cardAddForm.querySelector('#pid').getAttribute('name'),
    }

    const historyForm = root.querySelector('form#cardhistory')
    const history = {
      token: historyForm.querySelector('#token_hys').getAttribute('name'),
      pid: historyForm.querySelector('#pid_hys').getAttribute('name'),
    }

    this.accountInfo = { root, balance, delCard, addCard, history }
    return this.accountInfo
  }
}

export default class SOTK extends aggregation(
  SOTKBase,
  SOTKLogin,
  SOTKCardsList,
  SOTKHistory
) { }