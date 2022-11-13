import SOTKAPI from '../out/index.js'
import './.env.js'

const SOTK = new SOTKAPI()
await SOTK.login({ 
  username: process.env.SOTK_USERNAME as string, 
  password: process.env.SOTK_PASSWORD as string 
})

const cards = await SOTK.getCards()
const cardsHistories = await Promise.all(
  cards.map(async card => [card.number, await card.getHistory(new Date('2022-02-24'))])
)

console.log('Истории ваших карт:')
cardsHistories.forEach(card => {
  console.log(card[0])
  console.log(card[1])
})