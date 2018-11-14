const router = require('express').Router()
const controller = require('./controller')

router.put('/', controller.retrieveCardSetAndUpdateDB)

module.exports = router
