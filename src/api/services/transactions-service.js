const _ = require('lodash')
const transactionsRepository = require('../repositories/transactions-repository.js')
const transactionsEnum = require('../enums/transactions-enum.js')
const errorBuilder = require('../utils/error-builder.js')
module.exports = new class TransactionsService {
  async reset () {
    try {
      transactionsRepository.reset()
    } catch (error) {
      throw error.message ? error.message : error
    }
  }

  async event (body) {
    if (!(body.amount > 0)) {
      throw errorBuilder('Amount must be a positive number')
    }

    switch (body.type) {
      case transactionsEnum.TYPE.DEPOSIT:
        return this.processDeposit(body.destination, body.amount)

      case transactionsEnum.TYPE.WITHDRAW:
        return this.processWithdraw(body.origin, body.amount)

      case transactionsEnum.TYPE.TRANSFER:
        return this.processTransfer(body.origin, body.destination, body.amount)

      default:
        throw errorBuilder('Invalid event type')
    }
  }

  async balance (query) {
    const accountId = query && query.account_id ? query.account_id.trim() : null
    if (!accountId) {
      throw errorBuilder('Account Id is required')
    }

    if (transactionsRepository.getByAccountId(accountId).length === 0) {
      throw errorBuilder(0, 404)
    }

    return this.getAcccountBalance(accountId)
  }

  getAcccountBalance (accountId) {
    const transactions = transactionsRepository.getByAccountId(accountId)
    return _.sumBy(transactions, (el) => { return el.type === transactionsEnum.TYPE.DEPOSIT ? el.amount : el.amount * -1 })
  }

  processDeposit (destination, amount) {
    if (!destination || !destination.trim()) {
      throw errorBuilder('Destination field is required')
    }

    transactionsRepository.create({
      accountId: destination,
      type: transactionsEnum.TYPE.DEPOSIT,
      amount: amount
    })

    const balance = this.getAcccountBalance(destination)

    return {
      destination: {
        id: destination,
        balance: balance
      }
    }
  }

  processWithdraw (origin, amount) {
    if (!origin || !origin.trim()) {
      throw errorBuilder('Origin field is required')
    }
    if (transactionsRepository.getByAccountId(origin).length === 0) {
      throw errorBuilder(0, 404)
    }

    const balance = this.getAcccountBalance(origin)
    if (balance <= 0) {
      throw errorBuilder('There are insufficient funds')
    }

    transactionsRepository.create({
      accountId: origin,
      type: transactionsEnum.TYPE.WITHDRAW,
      amount: amount
    })

    return {
      origin: {
        id: origin,
        balance: balance - amount
      }
    }
  }

  processTransfer (origin, destination, amount) {
    if (!origin || !origin.trim()) {
      throw errorBuilder('Origin field is required')
    }
    if (!destination || !destination.trim()) {
      throw errorBuilder('Destination field is required')
    }
    const withdraw = this.processWithdraw(origin, amount)
    const deposit = this.processDeposit(destination, amount)

    return {
      ...withdraw,
      ...deposit
    }
  }
}()
