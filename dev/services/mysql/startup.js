const SIGNALE = require('signale')

exports.initMySQLTables = async () => {
  try {
    // require('./creation/test')()
    require('./creation/create_card_table')()
  } catch (error) {
    SIGNALE.error(error)
  }
}
