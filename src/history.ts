import { format } from 'date-fns'
import { SOTKBase } from './index'

export default class SOTKHistory extends SOTKBase {
  async getHistory(cardID, startDate = new Date(), endDate = new Date()) {
    const { history } = await this.getAccountInfo()

    const historyResponse = await this.runOperation({
      pid: history.pid,
      [history.token]: 1,
      operation: 3,
      card: cardID,
      startday: format(startDate, 'yyyy-M-d'),
      endday: format(endDate, 'yyyy-M-d'),
    }, true)
    return historyResponse.data
  }
}