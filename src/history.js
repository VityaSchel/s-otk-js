export default class SOTKHistory {
  async getHistory(cardID, startDate, endDate = new Date()) {
    const { history } = await this.getAccountInfo()

    this.runOperation({
      pid: history.pid,
      [history.token]: 1,
      operation: 3,
      card: cardID,
      startday: 2022-2 - 22,
      endday: 2022 - 4 - 22,
    }, true)
  }
}