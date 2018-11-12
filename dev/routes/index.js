const router = require('express').Router()
const user = require('./user')
const info = require('./info')
const debug = require('./debug')
const updateDb = require('./update_db')

const baseApiUrl = process.env.BASE_API_URL || '/'
const routePrefix = baseApiUrl === '/' ? '' : baseApiUrl

router.use(`${routePrefix}/info`, info)
router.use(`${routePrefix}/user`, user)
router.use(`${routePrefix}/debug`, debug)
router.use(`${routePrefix}/update_db`, updateDb)

module.exports = router
