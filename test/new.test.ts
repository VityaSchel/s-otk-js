import './.env.ts'
import SOTKAPI from '../src/index'

const SOTK = new SOTKAPI()

const testLogin = true
if(testLogin) {
  describe('Logs in', () => {
    test('creates a user session', async () => {
      const loginResult = await SOTK.login({ 
        username: process.env.SOTK_USERNAME as string, 
        password: process.env.SOTK_PASSWORD as string 
      })
      expect(loginResult.sessionToken).toBeTruthy()
      expect(loginResult.csrfToken).toBeTruthy()
      expect(loginResult.authToken).toBeTruthy()

      console.log(await SOTK.getAccountInfo())
    }, 15000)
  })
} else {
  SOTK.credentials = {
    token: process.env.SOTK_TOKEN as string,
    authToken: process.env.SOTK_AUTHTOKEN as string,
    csrfToken: process.env.SOTK_CSRFTOKEN as string,
  }
}

// describe('Cards list operations', () => {
//   test('adds new card', async () => {
//     const operationResult = await SOTK.addCard(process.env.SOTK_TEST_CARD)
//     console.log(operationResult)
//     // expect()
//   })
//   test('removes a card', async () => {
//     const operationResult = await SOTK.deleteCard(process.env.SOTK_TEST_CARD)
//     console.log(operationResult)
//     // expect()
//   })
// })