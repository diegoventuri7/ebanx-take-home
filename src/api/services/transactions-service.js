const transactionsRepository = require('../repositories/transactions-repository.js')

module.exports = new class TransactionsService {
  async reset () {
    try {
      transactionsRepository.reset()
    } catch (error) {
      throw error.message ? error.message : error
    }
  }
}()
