const { initMySQLTables } = require(`${global.SERVER_ROOT}/services/mysql/startup`)

module.exports.setupDB = async () => {
  await initMySQLTables()
}

module.exports.getWebAppAPI = () => {
  return require(`${global.SERVER_ROOT}/routes`)
}
