const knex = require(`${global.SERVER_ROOT}/services/knex`)

module.exports = async () => {
  let results = await knex.select()
    .from('users')

  console.log('results', results)
}
