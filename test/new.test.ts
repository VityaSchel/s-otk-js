import './.env.ts'
import SOTKAPI from '../src/index'
import type { CardInfo } from '../src/cardsList'

const SOTK = new SOTKAPI()

const testLogin = false
describe('Logs in', () => {
  if(testLogin) {
    test('tries to login with invalid password', async () => {
      await expect(
        SOTK.login({
          username: process.env.SOTK_USERNAME as string,
          password: 'test'
        })
      ).rejects.toMatchObject({
        message: 'Couldn\'t login into SOTK: Credentials are invalid'
      })
    })
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

  const checkCard = async (card: CardInfo, correctCardNumber: string) => {
    card.balance === null && console.log(card)
    expect(card.balance).toBeTruthy()
    expect(card.type).toBeTruthy()
    expect(typeof card.short).toBe('string')
    expect(card.short.match(/^0*(\d+)$/)![1]).toBe(correctCardNumber)
  }

  test('gets card info', async () => {
    const operationResult = await SOTK.getCardInfo(process.env.SOTK_TEST_CARD as string)
    await checkCard(operationResult, process.env.SOTK_TEST_CARD as string)
  })

  test('gets cards list', async () => {
    const cards = await SOTK.getCards()
    expect(Array.isArray(cards)).toBe(true)
    for(const card of cards) {
      expect(typeof card.number).toBe('string')
      expect(card.number).toBeTruthy()
      await checkCard(await card.getInfo(), card.number)
    }
  }, 20000)

  test('removes a card', async () => {
    const operationResult = await SOTK.deleteCard(process.env.SOTK_TEST_CARD)
    expect(operationResult.success).toBe(true)
  })

  test('throws exception when trying to get info on card that is not added', async () => {
    await expect(SOTK.getCardInfo(process.env.SOTK_TEST_CARD as string))
      .rejects
      .toMatchObject({ message: 'SOTK operation error. Ошибка запроса:' })
  }, 10000)

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
  }, 20000)
})