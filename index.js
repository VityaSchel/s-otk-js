import { aggregation } from './src/utils.js'
import SOTKLogin from './src/login.js'
import SOTKCardsList from './src/cardsList.js'
import nodefetch from 'node-fetch'
import _ from 'lodash'
import cookie from 'cookie'

class SOTKBase {
  constructor() {
    this.credentials = {}
  }

  fetch(url, options = {}) {
    _.set(options, 'headers.set-cookie', 
      cookie.serialize('fb60ded04faae990cc1fc4ed1921fc75', this.credentials.token, { httpOnly: true}))
    return nodefetch(url, options)
  }
}

export default class SOTK extends aggregation(
  SOTKBase,
  SOTKLogin,
  SOTKCardsList
) { }