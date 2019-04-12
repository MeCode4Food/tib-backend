const etlOnlineAverages = require('./helpers/etl_online_averages')
const SIGNALE = require('signale')

module.exports = async () => {
  try {
    if (process.env.ETL_MODE === "1") etlOnlineAverages()
  } catch (error) {
    SIGNALE.error(error)
  }
}
