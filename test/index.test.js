import SOTKAPI from '../index.js'
import './.env.js'

const SOTK = new SOTKAPI()
// const loginResult = await SOTK.login({ username: 'vityaschel', password: process.env.SOTK_PASSWORD })
// console.log(loginResult)
SOTK.credentials.token = process.env.SOTK_TOKEN

// const cards = await SOTK.getCards()
// console.log(await cards[0].delete())
console.log(await SOTK.addCard(110000000))