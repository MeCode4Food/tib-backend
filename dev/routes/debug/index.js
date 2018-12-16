const router = require('express').Router()
const controller = require('./controller')

router.get('/', controller.runDebug)

module.exports = router
