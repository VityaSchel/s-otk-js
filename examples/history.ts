import SOTKAPI from '../out/index.js'
import './.env.js'

const SOTK = new SOTKAPI()
await SOTK.login({ 
  username: process.env.SOTK_USERNAME as string, 
  password: process.env.SOTK_PASSWORD as string 
})

const cards = await SOTK.getCards()
  
console.log('Истории ваших карт:')
for(const card of cards) {
  console.log(card.number)
  const history = await card.getHistory(new Date('2022-02-24'))
  console.log(history)
  console.log('Вы потратили уже', history.reduce((prev, entry) => prev + Number(entry.sum), 0).toFixed(2), 'рублей')
}