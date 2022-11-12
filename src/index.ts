import { aggregation } from './utils.js'
import SOTKLogin from './login.js'
import SOTKCardsList from './cardsList.js'
import SOTKHistory from './history.js'
import SOTKInvoices from './invoices.js'
import nodefetch, { Headers, HeadersInit, RequestInit } from 'node-fetch'
import cookie from 'cookie'
import { parse } from 'node-html-parser'
import { SOTKFields } from './_fields.js'

export type SOTKCredentials = {
  token?: string
  csrfToken?: string
  authToken?: string
}
export type SOTKAccount = {
  [key in 'balance' | 'delCard' | 'addCard' | 'history']: {
    token
    pid
  }
}

export class SOTKBase extends SOTKFields {
  constructor() {
    super()
    // this.credentials = {}
  }

  fetch(url, options: RequestInit = {}) {
    const sessionToken = this.credentials.token
    if(sessionToken === undefined) throw new Error('Token is not passed in SOTK')

    const headers = new Headers(options.headers)
    headers.set('cookie', [
      cookie.serialize('fb60ded04faae990cc1fc4ed1921fc75', sessionToken)
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
      token: balanceForm?.querySelector('#balance_token')?.getAttribute('name'),
      pid: balanceForm?.querySelector('#balance_pid')?.getAttribute('name'),
    }

    const delCardForm = root.querySelector('form#carddel')
    const delCard = {
      token: delCardForm?.querySelector('#token_del')?.getAttribute('name'),
      pid: delCardForm?.querySelector('#pid_del')?.getAttribute('name'),
    }

    const cardAddForm = root.querySelector('form#numtype')
    const addCard = {
      token: cardAddForm?.querySelector('#token')?.getAttribute('name'),
      pid: cardAddForm?.querySelector('#pid')?.getAttribute('name'),
    }

    const historyForm = root.querySelector('form#cardhistory')
    const history = {
      token: historyForm?.querySelector('#token_hys')?.getAttribute('name'),
      pid: historyForm?.querySelector('#pid_hys')?.getAttribute('name'),
    }

    this.accountInfo = { balance, delCard, addCard, history }
    return this.accountInfo
  }

  async runOperation(body, parseJSON = false) {
    const response = await this.fetch('https://s-otk.ru/index.php/index.php?option=com_ajax&module=lkabinet&format=json', {
      method: 'POST',
      body: new URLSearchParams(body)
    })

    const responseText = (await response.text()).trim()
    if (responseText === 'Ошибка запроса:') throw new Error('SOTK Card ID not found')

    if (parseJSON) {
      const operationResult = JSON.parse(responseText)
      return operationResult
    } else {
      return responseText
    }
  }
}

export default class SOTK extends aggregation(
  SOTKBase,
  SOTKLogin,
  SOTKCardsList,
  SOTKHistory,
  SOTKInvoices
) { }