const SIGNALE = require('signale')
const chalk = require('chalk')
const knex = require(`${global.SERVER_ROOT}/services/knex`)

module.exports = async () => {
  let tableExists = await knex.schema.hasTable('user_online_daily')
  if (!tableExists) {
    let query = knex.schema.createTable('user_online_daily', (table) => {
      table.string('id', 36).primary() // UUID
      table.date('date')
      table.integer('hour')
      table.integer('total')
      table.integer('online')
      table.integer('in_game')
    })

    await query
    console.log('query\n', query.toString())
    SIGNALE.success(`${chalk.cyan('user_online_daily')} table created successfully`)
  }
}
