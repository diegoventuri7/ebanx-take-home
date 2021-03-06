const express = require('express')
const transactionsController = require('../api/controllers/transactions-controller')

const router = express.Router()

router.post('/reset', transactionsController.reset)
router.post('/event', transactionsController.event)
router.get('/balance', transactionsController.balance)

module.exports = router
