import SOTKAPI from '..'

const SOTK = new SOTKAPI()
const loginResult = await SOTK.login({ username: 'vityaschel', password: process.env.SOTK_PASSWORD })
console.log(loginResult)