import './.env.ts'
import SOTKAPI from '../src/index'

const SOTK = new SOTKAPI()

const testLogin = false
describe('Logs in', () => {
  if(testLogin) {
    test('creates a user session', async () => {
      const loginResult = await SOTK.login({ 
        username: process.env.SOTK_USERNAME as string, 
        password: process.env.SOTK_PASSWORD as string 
      })
      expect(loginResult.sessionToken).toBeTruthy()
      expect(loginResult.csrfToken).toBeTruthy()
      expect(loginResult.authToken).toBeTruthy()
      console.log(loginResult)
    }, 10000)
  } else {
    test('reinstates a user session', async () => {
      SOTK.credentials = {
        token: process.env.SOTK_TOKEN as string,
        authToken: process.env.SOTK_AUTHTOKEN as string,
        csrfToken: process.env.SOTK_CSRFTOKEN as string,
      }
      const accountInfo = await SOTK.getAccountInfo()
      expect(accountInfo.balance.token).not.toBe(undefined)
      expect(accountInfo.balance.pid).not.toBe(undefined)
      expect(accountInfo.addCard.token).not.toBe(undefined)
      expect(accountInfo.addCard.pid).not.toBe(undefined)
      expect(accountInfo.delCard.token).not.toBe(undefined)
      expect(accountInfo.delCard.pid).not.toBe(undefined)
      expect(accountInfo.history.token).not.toBe(undefined)
      expect(accountInfo.history.pid).not.toBe(undefined)
      expect(accountInfo.root).not.toBe(undefined)
    })
  }
})

describe('Cards list operations', () => {
  test('adds new card', async () => {
    const operationResult = await SOTK.addCard(process.env.SOTK_TEST_CARD as string)
    expect(operationResult.success).toBe(true)
  })
  test('removes a card', async () => {
    const operationResult = await SOTK.deleteCard(process.env.SOTK_TEST_CARD)
    expect(operationResult.success).toBe(true)
  })
  test('throws exceptions when trying to add invalid cards', async () => {
    await expect(SOTK.addCard('0'))
      .rejects
      .toMatchObject({ message: 'SOTK CardID must be digits-only and either 9 or 19 digits long' })
    await expect(SOTK.addCard('-1'))
      .rejects
      .toMatchObject({ message: 'SOTK CardID must be digits-only and either 9 or 19 digits long' })
    await expect(SOTK.addCard('000000000'))
      .rejects
      .toMatchObject({ message: 'Couldn\'t add a new SOTK card due to the following reason: Карта 000000000 в базе не найдена' })
    await expect(SOTK.addCard('100999999'))
      .rejects
      .toMatchObject({ message: 'Couldn\'t add a new SOTK card due to the following reason: Карта 100999999 в базе не найдена' })
  })
})