const knex = require(`${global.SERVER_ROOT}/services/knex`)
const SIGNALE = require('signale')

module.exports.searchForCard = async (query) => {
  try {
    let searchForCardQuery = knex.select()
      .from('cards')
      .where('card_name', 'like', `%${query}%`)
      .limit(1)

    console.log('query\n', searchForCardQuery.toString())

    let result = await searchForCardQuery
    console.log('result\n', result)
    return result
  } catch (error) {
    SIGNALE.error(error)
  }
}

// TODO custom search keywords such as  bb = bristleback, blink = blink dagger
