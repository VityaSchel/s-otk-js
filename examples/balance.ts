import SOTKAPI from '../out/index.js'
import './.env.js'

const SOTK = new SOTKAPI()
await SOTK.login({ 
  username: process.env.SOTK_USERNAME as string, 
  password: process.env.SOTK_PASSWORD as string 
})

const cards = await SOTK.getCards()
const cardsInfo = await Promise.all(
  cards.map(card => card.getInfo())
)
console.log('Баланс ваших карт:')
cardsInfo.forEach(card => console.log(card.short + ': ' + card.balance))