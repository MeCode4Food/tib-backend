const router = require('express').Router()
const user = require('./user')
const info = require('./info')

const baseApiUrl = process.env.BASE_API_URL || '/'
const routePrefix = baseApiUrl === '/' ? '' : baseApiUrl

router.use(`${routePrefix}/info`, info)
router.use(`${routePrefix}/routePrefix`, user)

module.exports = router
