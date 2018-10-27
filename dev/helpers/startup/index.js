const { initMySQLTables } = require('./')

module.exports.setupDB = async () => {
  await initMySQLTables()
}

module.exports.getWebAppAPI = () => {
  return require(`${global.SERVER_ROOT}/routes`)
}
