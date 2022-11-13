import fetch from 'node-fetch'
import { parse } from 'node-html-parser'
import cookie from 'cookie'
import { SOTKBase, SOTKCredentials } from './index'

export async function login(this: SOTKBase, credentials: { username: string, password: string }): Promise<SessionData> {
  const session = await startSession.bind(this)()
  const { sessionToken, authToken, csrfToken } = session
  this.credentials.token = sessionToken
  this.credentials.csrfToken = csrfToken
  this.credentials.authToken = authToken
  const body = new URLSearchParams({
    username: credentials.username, 
    password: credentials.password,
    remember: 'on',
    option: 'com_users',
    task: 'user.login',
    return: 'aW5kZXgucGhwP0l0ZW1pZD0xMTk=',
    [authToken as string]: '1'
  })
  const headers = { 
    'Content-Type': 'application/x-www-form-urlencoded', 
    'Content-Length': body.toString().length.toString(),
    'Host': 's-otk.ru'
  }
  const response = await this.fetch('https://s-otk.ru/index.php/passengerlk', {
    method: 'POST',
    headers,
    body: body.toString(),
    redirect: 'manual'
  })
  if(response.headers.get('Location') === '/index.php/registration?view=login') throw new Error('Couldn\'t login into SOTK: Credentials are invalid')
  const SET_COOKIE_HEADER = response.headers.get('set-cookie')
  if(!SET_COOKIE_HEADER) throw new Error('Couldn\'t start new SOTK session')
  const cookies = cookie.parse(SET_COOKIE_HEADER)
  const newSessionToken = cookies['fb60ded04faae990cc1fc4ed1921fc75']
  if(!newSessionToken) throw new Error('Couldn\'t log user into SOTK')
  this.credentials.token = newSessionToken
  return {
    authToken: authToken,
    csrfToken: csrfToken,
    sessionToken: newSessionToken
  }
}

export async function logout(this: SOTKBase) {
  const authToken = this.credentials.authToken
  if(!authToken) throw new Error('Must be logged into account in order to logout')
  await this.fetch('https://s-otk.ru/index.php/passengerlk', {
    method: 'POST',
    body: new URLSearchParams({
      option: 'com_users',
      task: 'user.logout',
      return: 'aW5kZXgucGhwP0l0ZW1pZD0xMDE=',
      [authToken]: '1'
    })
  })
}

export type SessionData = {
  sessionToken: string
  authToken: string
  csrfToken: string
}
export async function startSession(this: SOTKBase): Promise<SessionData> {
  const response = await fetch('https://s-otk.ru/index.php/passengerlk')
  const loginPage = await response.text()
  const root = parse(loginPage)
  const authToken = root
    ?.querySelector('form[action="/index.php/passengerlk"] > input[type="hidden"][value="1"]')
    ?.getAttribute('name') as string
  const SET_COOKIE_HEADER = response.headers.get('set-cookie')
  if(!SET_COOKIE_HEADER) throw new Error('Couldn\'t start new SOTK session')
  const cookies = cookie.parse(SET_COOKIE_HEADER)
  const sessionToken = cookies['fb60ded04faae990cc1fc4ed1921fc75']
  const ssrJSONRaw = root
    ?.querySelector('head > script[type="application/json"]')
    ?.innerHTML
  if(!ssrJSONRaw) throw new Error('Couldn\'t parse SSR content of s-otk.ru')
  const ssrJSON = JSON.parse(ssrJSONRaw)
  const csrfToken = ssrJSON['csrf.token']
  return { sessionToken, authToken, csrfToken }
}