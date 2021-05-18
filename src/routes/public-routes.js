const express = require('express')
const transactionsController = require('../api/controllers/transactions-controller')

const router = express.Router()

router.post('/reset', transactionsController.reset)

module.exports = router
