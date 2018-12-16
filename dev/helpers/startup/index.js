const { initMySQLTables } = require('./helpers/mysql_init_tables')
const startMysqlPing = require('./helpers/mysql_ping')
const startETLScripts = require('../scheduled_scripts/etl')

module.exports.setupDB = async () => {
  await initMySQLTables()
}

module.exports.getWebAppAPI = () => {
  return require(`${global.SERVER_ROOT}/routes`)
}

module.exports.setupTimedScripts = async () => {
  startMysqlPing()
  startETLScripts()
}
