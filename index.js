import { aggregation } from './src/utils.js'
import SOTKLogin from './src/login.js'

class SOTKBase {
  constructor() {
    this.credentials = {}
  }
}

export default class SOTK extends aggregation(
  SOTKBase,
  SOTKLogin
) { }