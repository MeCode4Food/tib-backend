const express = require('./services/express')
const http = require('http')

const { setupDB, getWebAppAPI } = require('./helpers/startup')

// DB Configurations
setupDB()

// API Routing Configurations
const api = getWebAppAPI() // get express.Router()

// load in api routes into the custom made express service
const app = express(api)
app.server = http.createServer(app)

module.exports = app
