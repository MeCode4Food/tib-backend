const etlOnlineAverages = require('./helpers/etl_online_averages')
const SIGNALE = require('signale')

module.exports = async () => {
  try {
    etlOnlineAverages()
  } catch (error) {
    SIGNALE.error(error)
  }
}
