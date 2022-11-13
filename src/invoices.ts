import { SOTKBase } from './index'

type Invoice = {
  /** URL шлюза оплаты */
  formUrl: string
  errorCode: number
  errorMessage?: string
  /** UUID счета */
  orderId: string
}

type Check = {
  rscode: false
  /** Error message */
  rsdata: string
} | {
  rscode: true
  series: number
  series_desc: string
  /** В копейках */
  min_sum: number
  company_name: string 
  company_inn: string
  company_phone: string
  sessionid: string
  /** В копейках */
  tariffmaxsum: number
  tariffostatok: number
}

export async function createInvoice(
  this: SOTKBase, 
  /** Счет можно создать на любую карту, необязательно привязанную к аккаунту */
  cardID: string, 
  /** Целое число в копейках, например 1 рубль — это sum=100 */
  sum: number
): Promise<Invoice> {
  if(!Number.isInteger(sum)) throw new Error('Couldn\'t create invoice for SOTK where sum parameter is not integer')

  const { balance } = await this.getAccountInfo()
  const checkResponse = await this.runJSONOperation({
    pid: balance.pid,
    [balance.token]: '1',
    operation: '4',
    card: cardID
  })
  
  const check = checkResponse.data[0] as Check
  if (!check.rscode) throw {
    message: 'Couldn\'t create a check: ' + check.rsdata,
    check
  }
  
  const SID = check.sessionid
  const invoiceResponse = await this.runJSONOperation({
    pid: balance.pid,
    [balance.token]: '1',
    operation: '5',
    card: cardID,
    tariffid: '10',
    paymentsum: String(sum),
    sessionid: SID
  })

  const invoice = invoiceResponse.data as Invoice
  if(invoice.errorCode !== 0) throw new Error('Couldn\'t create an invoice: ' + invoice.errorMessage)

  return invoice
}