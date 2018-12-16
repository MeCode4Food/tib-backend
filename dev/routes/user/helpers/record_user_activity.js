const uuidv4 = require('uuid/v4')
const knex = require(`${global.SERVER_ROOT}/services/knex`)

/**
 * Records user activity to DB
 * @string userID
 * @isoDate eventDate
 * @string userActivity
 */
module.exports = async (userID, eventDate, userActivity) => {
  try {
    let object = {
      id: uuidv4(),
      user_id: userID,
      timestamp: eventDate,
      activity: userActivity
    }

    let query = knex('user_activity').insert(object)

    await query

    return object
  } catch (error) {
    throw error
  }
}
