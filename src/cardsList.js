import FormData from 'form-data'

export default class SOTKCardsList {
  async getCardInfo(cardID) {
    const body = new FormData()
    body.append('operation', 6)
    body.append('card', cardID)
    body.append(this.credentials.csrfToken, 1)
    const response = await this.fetch(`https://s-otk.ru/index.php/index.php?option=com_ajax&module=lkabinet&format=json`, {
      method: 'POST',
      body
    })
    const cardInfo = await response.text()
    return cardInfo
  }
}