const { initMySQLTables } = require('./helpers/mysql_init_tables')
const startMySQLPing = require('../scheduled_scripts/ping_db')
const startETLScripts = require('../scheduled_scripts/etl')

module.exports.setupDB = async () => {
  await initMySQLTables()
}

module.exports.getWebAppAPI = () => {
  return require(`${global.SERVER_ROOT}/routes`)
}

module.exports.setupTimedScripts = async () => {
  startMySQLPing()
  startETLScripts()
}
