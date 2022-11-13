import { SOTKBase } from './index'

export async function getCards(this: SOTKBase) {
  const { root } = await this.getAccountInfo()
  const cards = root
    .querySelectorAll('#cardslist span.getcardinfo')
    .map(cardElement => ({
      number: cardElement.innerText,
      getInfo: () => this.getCardInfo(cardElement.innerText),
      getHistory: (startDate = new Date(), endDate = new Date()) => this.getHistory(cardElement.innerText, startDate, endDate),
      delete: () => this.deleteCard(cardElement.innerText)
    }))
  return cards
}

export type CardInfo = {
  /** Строка с номером карты, может содержать нули в начале */
  short: string
  ctg: number
  /** Описание, например "Карта Школьника" */
  ctgdesk: string
  /** Строка, содержащая баланс карты, дробная часть отделяется точкой */
  balance: string
  st_limit: null | any
  type: string
}
export async function getCardInfo(this: SOTKBase, cardID): Promise<CardInfo> {
  const { balance } = await this.getAccountInfo()

  const cardInfoResponse = await this.runJSONOperation({
    operation: '6',
    card: cardID,
    [balance.token]: '1',
    pid: String(balance.pid)
  })
  return cardInfoResponse.data as CardInfo
}

const cardIDRegex = /^(\d{9}|\d{19})$/

export async function addCard(this: SOTKBase, cardID: string) {
  if(!cardIDRegex.test(cardID)) throw new Error('SOTK CardID must be digits-only and either 9 or 19 digits long')
  const { addCard } = await this.getAccountInfo()

  const cardAdded = await this.runJSONOperation({
    operation: '1',
    card: cardID,
    [addCard.token]: '1',
    pid: String(addCard.pid)
  })
  const success = new RegExp(`^Карта ${cardID} прикреплена$`).test(cardAdded.data)
  if(!success) throw new Error(`Couldn\'t add a new SOTK card due to the following reason: ${cardAdded.data}`)
  return { ...cardAdded, success }
}

export async function deleteCard(this: SOTKBase, cardID) {
  if(!cardIDRegex.test(cardID)) throw new Error('SOTK CardID must be digits-only and either 9 or 19 digits long')
  const { delCard } = await this.getAccountInfo()

  const cardDeletion = await this.runJSONOperation({
    operation: '2',
    card: cardID,
    [delCard.token]: '1',
    pid: String(delCard.pid)
  })
  const success = cardDeletion.data === 'Функция базы данных сработала без ошибок'
  if(!success) throw new Error(`Couldn\'t delete a SOTK card due to the following reason: ${cardDeletion.data}`)
  return { ...cardDeletion, success }
}