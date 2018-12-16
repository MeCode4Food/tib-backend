const SIGNALE = require('signale')

exports.initMySQLTables = async () => {
  try {
    // require('./creation/test')()
    require('../../stored_procedures/init_tables/create_card_table')()
    require('../../stored_procedures/init_tables/create_user_activity_table')()
    require('../../stored_procedures/init_tables/create_user_online_averages')()
    require('../../stored_procedures/init_tables/create_user_online_daily')()
  } catch (error) {
    SIGNALE.error(error)
  }
}
