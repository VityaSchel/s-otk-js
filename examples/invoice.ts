import SOTKAPI from '../out/index.js'
import './.env.js'

const SOTK = new SOTKAPI()
await SOTK.login({ 
  username: process.env.SOTK_USERNAME as string, 
  password: process.env.SOTK_PASSWORD as string 
})

console.log(
  await SOTK.createInvoice(process.env.SOTK_TEST_CARD as string, '100.0')
)