const express = require('./services/express')
const http = require('http')
const SIGNALE = require('signale')
const chalk = require('chalk')

const { setupDB, getWebAppAPI, setupTimedScripts } = require('./helpers/startup')

const os = require('os')
const port = process.env.EXPRESS_PORT
const ip = process.env.IP || 'localhost'
const env = process.env.NODE_ENV

// DB Configurations
setupDB()

// Set up timed scripts
setupTimedScripts()

// API Routing Configurations
const api = getWebAppAPI() // get express.Router()

// Load express middleware into app and create server
const app = express(api)
const server = http.createServer(app)

// ------- Start Server -------
setImmediate(() => {
  server.listen(port, ip, () => {
    SIGNALE.info(`Server started on ${chalk.cyan(os.hostname())} - ` + chalk.cyan(`http://${ip}:${port}`) + `, in ${chalk.yellow(env)} mode`)
  })
})

module.exports = app
