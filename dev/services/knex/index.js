const config = require('../mysql').config
const knex = require('knex')(config)
const chalk = require('chalk')
const SIGNALE = require('signale')

SIGNALE.info(`MySQL Database Connected Succesfully on ` + chalk.cyan(`${config.connection.user}@${config.connection.host}`))

module.exports = knex
