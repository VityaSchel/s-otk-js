import { SOTKBase } from './index'

export async function createInvoice(this: SOTKBase, cardID, sum) {
  const { balance } = await this.getAccountInfo()
  const checkResponse = await this.runOperation({
    pid: balance.pid,
    [balance.token]: 1,
    operation: 4,
    card: cardID
  }, true)
  
  const check = JSON.parse(checkResponse.data)
  if (!check[0].rscode) throw new Error('Couldn\'t create a check: ' + check[0].rsdata)
  
  const SID = check[0].sessionid
  const invoiceResponse = await this.runOperation({
    pid: balance.pid,
    [balance.token]: 1,
    operation: 5,
    card: cardID,
    tariffid: 10,
    paymentsum: sum,
    sessionid: SID
  }, true)

  const invoice = JSON.parse(invoiceResponse.data)
  if(invoice.errorCode !== 0) throw new Error('Couldn\'t create an invoice: ' + invoice.errorMessage)

  return invoice.formUrl
}