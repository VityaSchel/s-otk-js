import fetch from 'node-fetch'
import { parse } from 'node-html-parser'
import cookie from 'cookie'

export default class SOTKLogin {
  async login({ username, password }) {
    const { sessionToken, authToken } = await startSession()
    this.credentials.token = sessionToken
    const response = await fetch('https://s-otk.ru/index.php/passengerlk', {
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
    console.log(response.headers, response.cookies, await response.text())
  }
}

async function startSession() {
  const response = await fetch(`https://s-otk.ru/index.php/passengerlk`)
  const loginPage = await response.text()
  const authToken = parse(loginPage)
    .querySelector('form[action="/index.php/passengerlk"] > input[type="hidden"][value="1"]')
    .getAttribute('value')
  const cookies = cookie.parse(response.cookies)
  const sessionToken = cookies['fb60ded04faae990cc1fc4ed1921fc75']
  return { sessionToken, authToken }
}