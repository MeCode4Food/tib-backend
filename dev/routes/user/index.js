const router = require('express').Router()
const controller = require('./controller')

router.get('/search', controller.getCardByName)

router.put('/update', controller.updateCardDBUsingJSONFile)

module.exports = router
