const transactionsService = require('../services/transactions-service.js')

exports.reset = function (req, res) {
  transactionsService.reset().then(() => {
    res.json('OK')
  }).catch(err => {
    res.statusCode = 400
    res.json({ date: new Date(), errors: err })
  })
}

exports.event = function (req, res) {
  transactionsService.event(req.body).then((response) => {
    res.statusCode = 201
    res.json(response)
  }).catch(err => {
    res.statusCode = err.statusCode
    res.json(err.message)
  })
}

exports.balance = function (req, res) {
  transactionsService.balance(req.query).then((response) => {
    res.statusCode = 200
    res.json(response)
  }).catch(err => {
    res.statusCode = err.statusCode
    res.json(err.message)
  })
}
