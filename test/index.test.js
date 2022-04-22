import SOTKAPI from '../index.js'

const SOTK = new SOTKAPI()
// const loginResult = await SOTK.login({ username: 'vityaschel', password: process.env.SOTK_PASSWORD })
// console.log(loginResult)
SOTK.credentials.token = 'pb43pu8vk6i0d99rvp08uice41'

console.log(await SOTK.getCardInfo(100249726))