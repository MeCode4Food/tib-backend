const router = require('express').Router()
const controller = require('./controller')

router.post('/activity', controller.recordNewActivity)
router.post('/hourlyActivity', controller.recordHourlyActivity)

module.exports = router
