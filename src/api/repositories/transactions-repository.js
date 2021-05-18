
module.exports = new class TransactionsRepository {
  constructor () {
    this.transactions = []
  }

  reset () {
    this.transactions = []
  }
}()
