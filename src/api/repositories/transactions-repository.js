const _ = require('lodash')
module.exports = new class TransactionsRepository {
  constructor () {
    this.transactions = []
  }

  reset () {
    this.transactions = []
  }

  create (transaction) {
    this.transactions.push(transaction)
  }

  getByAccountId (accountId) {
    return _.filter(this.transactions, { accountId: accountId })
  }
}()
