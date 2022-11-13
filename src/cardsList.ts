import { SOTKBase } from './index'

export async function getCards(this: SOTKBase) {
  const { root } = await this.getAccountInfo()
  const cards = root
    .querySelectorAll('#cardslist span.getcardinfo')
    .map(cardElement => ({
      number: cardElement.innerText,
      getInfo: () => this.getCardInfo(cardElement.innerText),
      getHistory: (startDate, endDate) => this.getHistory(cardElement.innerText, startDate, endDate),
      delete: () => this.deleteCard(cardElement.innerText)
    }))
  return cards
}

export async function getCardInfo(this: SOTKBase, cardID) {
  const { balance } = await this.getAccountInfo()

  const cardInfoResponse = await this.runJSONOperation({
    operation: '6',
    card: cardID,
    [balance.token]: '1',
    pid: String(balance.pid)
  })
  return cardInfoResponse
}

export async function addCard(this: SOTKBase, cardID: string) {
  const { addCard } = await this.getAccountInfo()

  const cardAdded = await this.runJSONOperation({
    operation: '1',
    card: cardID,
    [addCard.token]: '1',
    pid: String(addCard.pid)
  })
  if(!cardAdded.success) throw new Error(`Couldn\'t add a new SOTK card due to the following reason: ${cardAdded.data}`)
  return cardAdded
}

export async function deleteCard(this: SOTKBase, cardID) {
  const { delCard } = await this.getAccountInfo()

  const cardDeletion = await this.runJSONOperation({
    operation: '2',
    card: cardID,
    [delCard.token]: '1',
    pid: String(delCard.pid)
  })
  if(!cardDeletion.success) throw new Error(`Couldn\'t delete a SOTK card due to the following reason: ${cardDeletion.data}`)
  return cardDeletion
}