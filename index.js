require('dotenv').config()
const SIGNALE = require('signale')
const chalk = require('chalk')
const { NODE_ENV } = process.env

console.log()
SIGNALE.start(`Starting ${chalk.magenta(NODE_ENV)} build`)

module.exports = require(`./${NODE_ENV}`)
