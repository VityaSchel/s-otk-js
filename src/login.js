import fetch from 'node-fetch'
import { parse } from 'node-html-parser'
import cookie from 'cookie'

export default class SOTKLogin {
  async login({ username, password }) {
    const session = await startSession()
    const { sessionToken, authToken, csrfToken } = session
    this.credentials.token = sessionToken
    this.credentials.csrfToken = csrfToken
    this.credentials.authToken = authToken
    await fetch('https://s-otk.ru/index.php/passengerlk', {
      method: 'POST',
      body: new URLSearchParams({
        username, password,
        remember: 'on',
        option: 'com_users',
        task: 'user.login',
        return: 'aW5kZXgucGhwP0l0ZW1pZD0xMTk=',
        [authToken]: 1
      })
    })
    return session
  }

  async logout() {
    await this.fetch('https://s-otk.ru/index.php/passengerlk', {
      method: 'POST',
      body: new URLSearchParams({
        option: 'com_users',
        task: 'user.logout',
        return: 'aW5kZXgucGhwP0l0ZW1pZD0xMDE=',
        [this.credentials.authToken]: 1
      })
    })
  }
}

async function startSession() {
  const response = await fetch('https://s-otk.ru/index.php/passengerlk')
  const loginPage = await response.text()
  const root = parse(loginPage)
  const authToken = root
    .querySelector('form[action="/index.php/passengerlk"] > input[type="hidden"][value="1"]')
    .getAttribute('name')
  const cookies = cookie.parse(response.headers.get('set-cookie'))
  const sessionToken = cookies['fb60ded04faae990cc1fc4ed1921fc75']
  const ssrJSONRaw = root
    .querySelector('head > script[type="application/json"]')
    .innerHTML
  const ssrJSON = JSON.parse(ssrJSONRaw)
  const csrfToken = ssrJSON['csrf.token']
  return { sessionToken, authToken, csrfToken }
}