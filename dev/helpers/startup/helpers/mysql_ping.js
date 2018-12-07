const knex = require(`${global.SERVER_ROOT}/services/knex`)

module.exports = async () => {
  let pingResult = 0
  try {
    pingResult = await knex.select(1)
    if (pingResult === 0) throw new Error('Ping Failed')
  } catch (error) {
    throw error
  }
}
