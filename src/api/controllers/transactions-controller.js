const transactionsService = require('../services/transactions-service.js')

exports.reset = function (req, res) {
  transactionsService.reset().then(() => {
    res.json('OK')
  }).catch(err => { res.statusCode = 400; res.json({ date: new Date(), errors: err }) })
}