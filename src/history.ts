import { format } from 'date-fns'
import { SOTKBase } from './index'

export type HistoryEntry = {
  /** Дата в формате "dd mm yyyy hh:mm:ss" */
  dt: string
  /** Сумма транзакции, дробная часть отделена точкой (конвертируется в число) */
  sum: string
  /** Номер маршрута (конвертируется в число) */
  code: string
  /** Тип поездки (конвертируется в число) */
  vichle: string
}
export async function getHistory(this: SOTKBase, cardID, startDate = new Date(), endDate = new Date()): Promise<HistoryEntry[]> {
  const { history } = await this.getAccountInfo()

  const historyResponse = await this.runJSONOperation({
    pid: history.pid,
    [history.token]: '1',
    operation: '3',
    card: cardID,
    startday: format(startDate, 'yyyy-M-d'),
    endday: format(endDate, 'yyyy-M-d'),
  })
  return historyResponse.data as HistoryEntry[]
}