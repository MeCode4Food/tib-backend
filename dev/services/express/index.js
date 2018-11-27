
const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')
const graphql = require('../graphql')

const config = process.env
const app = express()

module.exports = (routes) => {
  // logger
  app.use(morgan('dev'))

  // 3rd party middleware for handling cors
  app.use(cors({
    exposedHeaders: config.corsHeaders
  }))

  // body parser
  app.use(bodyParser.json({
    limit: config.bodyLimit
  }))

  // helmet set up
  app.use(helmet())

  app.all('*', function (req, res, next) {
    next()
  })

  // mount graphql on route 'root/graphql'
  app.use('/graphql', graphql)
  app.use(routes)

  return app
}
