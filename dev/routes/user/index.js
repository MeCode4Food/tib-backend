const router = require('express').Router()
const controller = require('./controller')

router.post('/activity', controller.recordNewActivity)

module.exports = router
