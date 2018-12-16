const knex = require(`${global.SERVER_ROOT}/services/knex`)
const SIGNALE = require('signale')

const pingDB = async () => {
  let pingResult = 0
  try {
    pingResult = await knex.select(1)
    if (pingResult === 0) throw new Error('Ping Failed')
  } catch (error) {
    throw error
  }
}

module.exports = async () => {
  const interval = 1000 * 60 * 60 // hours interval

  setInterval(async () => {
    try {
      await pingDB()
    } catch (error) {
      SIGNALE.error('Ping error', error)
    } finally {
      // console.log('DB Pinged')
    }
  }, interval)
}
