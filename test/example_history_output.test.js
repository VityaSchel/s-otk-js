import SOTKAPI from '../index.js'
import './.env.js'

const SOTK = new SOTKAPI()
// await SOTK.login({ username: 'bear-frede', password: '28.08.2020' })
SOTK.credentials.token = process.env.SOTK_TOKEN

const cards = await SOTK.getCards()
const cardsHistories = await Promise.all(
  cards.map(async card => [card.number, await card.getHistory(new Date('2022-02-22'))])
)
console.log('Истории ваших карт:')
cardsHistories.forEach(card => {
  console.log(card[0])
  console.log(card[1])
})