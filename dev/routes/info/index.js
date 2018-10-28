const router = require('express').Router()
const controller = require('./controller')

router.all('/', controller.handleInfo)

module.exports = router
