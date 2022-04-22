export default class SOTKCardsList {
  async getCardInfo(cardID) {
    const { balance } = await this.getAccountInfo()

    const response = await this.fetch('https://s-otk.ru/index.php/index.php?option=com_ajax&module=lkabinet&format=json', {
      method: 'POST',
      body: new URLSearchParams({
        operation: 6,
        card: cardID,
        [balance.token]: 1,
        pid: [balance.pid]
      })
    })
    
    const responseText = (await response.text()).trim()
    if (responseText === 'Ошибка запроса:') throw new Error('Card ID not found')

    const cardInfoResponse = JSON.parse(responseText)
    const cardInfo = JSON.parse(cardInfoResponse.data)
    return cardInfo
  }
}