
const express = require('express')
const bodyParser = require('body-parser')
const connection = require('express-myconnection')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')
const mysql = require('')

const config = process.env
const app = express()

module.exports = (routes) => {
  // logger
  app.use(morgan('dev'))

  // 3rd party middleware for handling cors
  app.use(cors({
    exposedHeaders: config.corsHeaders
  }))

  app.use(bodyParser.json({
    limit: config.bodyLimit
  }))

  app.use(helmet)

  app.use(connection(mysql, config.database))

  app.all('*', function (req, res, next) {
    next()
  })
  app.use(routes)

  return app
}
