const knex = require(`${global.SERVER_ROOT}/services/knex`)

/**
 * Records user activity to DB
 * @string userID
 * @isoDate eventDate
 * @string userActivity
 */
module.exports = async (timestamp, hour, online, inGame, total) => {
  try {
    let object = {
      timestamp: timestamp,
      online: online,
      in_game: inGame,
      total: total
    }

    let query = knex('user_online_daily').insert(object)

    await query

    return object
  } catch (error) {
    throw error
  }
}
