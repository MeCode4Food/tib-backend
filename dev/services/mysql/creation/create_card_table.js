const SIGNALE = require('signale')
const chalk = require('chalk')
const knex = require(`${global.SERVER_ROOT}/services/knex`)

module.exports = async () => {
  let tableExists = await knex.schema.hasTable('cards')
  if (!tableExists) {
    let query = knex.schema.createTable('cards', (table) => {
      table.integer('card_id').primary()
      table.string('card_name').notNullable()
      table.string('card_type').notNullable()
      table.string('card_text')
      table.string('card_image')
      table.string('colour').notNullable()
      table.string('rarity')

      // card relations
      table.integer('signature_id')
      table.integer('parent_id')
      table.integer('passive_id')
      table.integer('active_id')
      table.integer('reference_id')

      // card stats
      table.integer('attack')
      table.integer('armour')
      table.integer('hit_points')
      table.integer('mana_cost')
      table.integer('gold_cost')
    })

    await query
    console.log('query\n', query.toString())
    SIGNALE.success(`${chalk.cyan('cards')} table created successfully`)
  }
}
