const { initMySQLTables } = require(`${global.SERVER_ROOT}/services/mysql/startup`)
const pingDB = require('./helpers/mysql_ping')

module.exports.setupDB = async () => {
  await initMySQLTables()
}

module.exports.getWebAppAPI = () => {
  return require(`${global.SERVER_ROOT}/routes`)
}

module.exports.setupTimedScripts = async () => {
  const interval = 1000 // 1000 * 60 * 60 * 7 // 7 hours interval

  setTimeout(async () => {
    try {
      await pingDB()
    } catch (error) {
      console.log('Timed Script error', error)
    } finally {
      console.log('DB Pinged')
    }
  }, interval)
}
