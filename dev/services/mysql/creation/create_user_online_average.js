const SIGNALE = require('signale')
const chalk = require('chalk')
const knex = require(`${global.SERVER_ROOT}/services/knex`)

module.exports = async () => {
  let tableName = 'user_online_average'
  let tableExists = await knex.schema.hasTable(tableName)
  if (!tableExists) {
    let query = knex.schema.createTable(tableName, (table) => {
      table.string('id', 36).primary() // UUID
      table.date('date')
      table.integer('average_online_hours')
      table.integer('average_game_hours')
    })

    await query
    console.log('query\n', query.toString())
    SIGNALE.success(`${chalk.cyan(tableName)} table created successfully`)
  }
}
