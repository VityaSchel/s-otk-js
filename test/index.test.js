import SOTKAPI from '../index.js'

const SOTK = new SOTKAPI()
// const loginResult = await SOTK.login({ username: 'vityaschel', password: process.env.SOTK_PASSWORD })
// console.log(loginResult)
SOTK.credentials.token = process.env.SOTK_TOKEN

console.log(await SOTK.getCardInfo(100249727))