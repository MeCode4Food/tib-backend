const router = require('express').Router()
const controller = require('./controller')

router.get('/', controller.getCardFromQuery)

module.exports = router
