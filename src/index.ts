import * as SOTKLogin from './login'
import * as SOTKCardsList from './cardsList'
import * as SOTKHistory from './history'
import * as SOTKInvoices from './invoices'
import nodefetch, { Headers, HeadersInit, RequestInit } from 'node-fetch'
import cookie from 'cookie'
import { HTMLElement, parse } from 'node-html-parser'

export type SOTKCredentials = {
  token?: string
  csrfToken?: string
  authToken?: string
}
export type SOTKAccount = {
  root: HTMLElement
  balance: {
    token
    pid
  }
  delCard: {
    token
    pid
  }
  addCard: {
    token
    pid
  }
  history: {
    token
    pid
  }
}
export type OperationResult = {
  /** JSON-parsed result of operation. May be unicode-decoded text, object or anything else */
  data: any
  success: boolean
  message: null | any
  messages: null | any
}
export class SOTKOperationError extends Error {
  code: string
  rawResponse: string

  constructor(message: string, code: string, rawResponse: string) {
    super(message)
    this.name = 'SOTKOperationError'
    this.code = code
    this.rawResponse = rawResponse
  }
}

export class SOTKBase {
  credentials: SOTKCredentials = {}
  accountInfo: null | SOTKAccount = null

  constructor() {
    // this.credentials = {}
  }

  fetch(url, options: RequestInit = {}) {
    const sessionToken = this.credentials.token
    if(sessionToken === undefined) throw new Error('Token is not passed in SOTK')

    const headers = new Headers(options.headers)
    headers.set('Cookie', [
      cookie.serialize('fb60ded04faae990cc1fc4ed1921fc75', sessionToken, { path: '/' }),
      cookie.serialize('joomla_user_state', 'logged_in'),
    ].join('; '))
    // DO NOT USE SET-COOKIE: https://stackoverflow.com/a/35258629/13689893
    return nodefetch(url, { ...options, headers })
  }

  async getAccountInfo(useCache = false) {
    if (useCache && this.accountInfo) return this.accountInfo

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

    this.accountInfo = { root, balance, delCard, addCard, history }
    return this.accountInfo
  }

  // REFACTOR: https://stackoverflow.com/questions/74419442/typescript-overload-function-signature-with-boolean-parameter-with-dependant-ret
  async runJSONOperation(body: { [key: string]: string }): Promise<OperationResult> {
    const result = await this.runOperation(body)

    const NOT_LOGGED_IN_RESPONSE = 'Уппс! Вам тут не рады'
    if(result === NOT_LOGGED_IN_RESPONSE) throw new SOTKOperationError('SOTK session isn\'t valid', 'NOT_LOGGED_IN', result)

    try {
      const operationResult = JSON.parse(result) as OperationResult
      try { 
        const jsonParsedResult = JSON.parse(operationResult.data)
        if(typeof jsonParsedResult === 'string') operationResult.data = decodeURIComponent(jsonParsedResult)
        else operationResult.data = jsonParsedResult
      } catch(e) {/**/}
      return operationResult
    } catch(e) {
      if(e instanceof SyntaxError) {
        throw new SOTKOperationError('Couldn\'t parse JSON result of SOTK API response', 'PARSE_ERROR', result)
      } else {
        throw e
      }
    }
  }

  async runOperation(body: { [key: string]: string }): Promise<string> {
    const response = await this.fetch('https://s-otk.ru/index.php/index.php?option=com_ajax&module=lkabinet&format=json', {
      method: 'POST',
      body: new URLSearchParams(body)
    })

    const responseText = (await response.text()).trim()
    if (responseText === 'Ошибка запроса:') {
      throw new Error('SOTK operation error. '.concat(responseText))
    }
    
    return responseText
  }

  login = SOTKLogin.login
  logout = SOTKLogin.logout
  getCards = SOTKCardsList.getCards
  getCardInfo = SOTKCardsList.getCardInfo
  addCard = SOTKCardsList.addCard
  deleteCard = SOTKCardsList.deleteCard
  getHistory = SOTKHistory.getHistory
  createInvoice = SOTKInvoices.createInvoice
}

export default SOTKBase