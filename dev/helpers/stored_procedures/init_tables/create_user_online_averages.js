const SIGNALE = require('signale')
const chalk = require('chalk')
const knex = require(`${global.SERVER_ROOT}/services/knex`)

module.exports = async () => {
  let tableName = 'user_online_averages'
  let tableExists = await knex.schema.hasTable(tableName)
  if (!tableExists) {
    let query = knex.schema.createTable(tableName, (table) => {
      table.string('id', 36).primary() // UUID
      table.date('date').unique()
      table.float('total_online_hours')
      table.float('total_gaming_hours')
      table.float('active_online_hours')
      table.float('active_gaming_hours')
      table.integer('total_users')
      table.integer('total_gamers')
      table.integer('active_users')
      table.integer('active_gamers')
    })

    await query
    console.log('query\n', query.toString())
    SIGNALE.success(`${chalk.cyan(tableName)} table created successfully`)
  }
}
