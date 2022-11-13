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

  const cardInfoResponse = await this.runOperation({
    operation: 6,
    card: cardID,
    [balance.token]: 1,
    pid: [balance.pid]
  }, true)
  const cardInfo = JSON.parse(cardInfoResponse.data)
  return cardInfo
}

export async function addCard(this: SOTKBase, cardID) {
  const { addCard } = await this.getAccountInfo()

  const cardAdded = await this.runOperation({
    operation: 1,
    card: cardID,
    [addCard.token]: 1,
    pid: [addCard.pid]
  })
  return cardAdded
}

export async function deleteCard(this: SOTKBase, cardID) {
  const { delCard } = await this.getAccountInfo()

  const cardDeletion = await this.runOperation({
    operation: 2,
    card: cardID,
    [delCard.token]: 1,
    pid: [delCard.pid]
  })
  return cardDeletion
}