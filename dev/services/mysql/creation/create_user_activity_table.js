const SIGNALE = require('signale')
const chalk = require('chalk')
const knex = require(`${global.SERVER_ROOT}/services/knex`)

module.exports = async () => {
  let tableExists = await knex.schema.hasTable('user_activity')
  if (!tableExists) {
    let query = knex.schema.createTable('user_activity', (table) => {
      table.string('id', 36).primary() // UUID
      table.string('user_id').notNullable()
      table.timestamp('timestamp')
      table.string('activity')
    })

    await query
    console.log('query\n', query.toString())
    SIGNALE.success(`${chalk.cyan('user_activity')} table created successfully`)
  }
}
