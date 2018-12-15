const SIGNALE = require('signale')

exports.initMySQLTables = async () => {
  try {
    // require('./creation/test')()
    require('./creation/create_card_table')()
    require('./creation/create_user_activity_table')()
  } catch (error) {
    SIGNALE.error(error)
  }
}
