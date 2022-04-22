export default class SOTKCardsList {
  async getCards() {
    const { root } = await this.getAccountInfo()
    const cards = root
      .querySelectorAll('#cardslist span.getcardinfo')
      .map(cardElement => ({
        cardNumber: cardElement.innerText,
        getInfo: () => this.getCardInfo(cardElement.innerText),
        delete: () => this.deleteCard(cardElement.innerText)
      }))
    return cards
  }

  async getCardInfo(cardID) {
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

  async addCard(cardID) {
    const { addCard } = await this.getAccountInfo()

    const cardAdded = await this.runOperation({
      operation: 1,
      card: cardID,
      [addCard.token]: 1,
      pid: [addCard.pid]
    })
    return cardAdded
  }

  async deleteCard(cardID) {
    const { delCard } = await this.getAccountInfo()

    const cardDeletion = await this.runOperation({
      operation: 2,
      card: cardID,
      [delCard.token]: 1,
      pid: [delCard.pid]
    })
    return cardDeletion
  }
}