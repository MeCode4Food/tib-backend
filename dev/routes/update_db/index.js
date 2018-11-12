const router = require('express').Router()
const controller = require('./controller')

router.get('/debug', controller.runNightmare)
