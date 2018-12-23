const respond = require(`${global.SERVER_ROOT}/services/response`)
const recordUserActivity = require('./helpers/record_user_activity')
const recordHourlyActivity = require('./helpers/record_hourly_activity')
const validateNewActivity = require('./helpers/validate_new_activity')
const validateHourlyActivity = require('./helpers/validate_hourly_activity')

exports.recordNewActivity = async (req, res) => {
  try {
    await validateNewActivity(req.body)
    let userID = req.body['user_id']
    let eventDate = req.body['date']
    let userActivity = req.body['activity']

    return respond.success(res, await recordUserActivity(userID, eventDate, userActivity))
  } catch (error) {
    return respond.failure(res, error)
  }
}

exports.recordHourlyActivity = async (req, res) => {
  try {
    await validateHourlyActivity(req.body)
    let date = req.body['date']
    let hour = req.body['hour']
    let online = req.body['online']
    let inGame = req.body['in_game']
    let total = req.body['total']

    return respond.success(res, await recordHourlyActivity(
      date,
      hour,
      online,
      inGame,
      total
    ))
  } catch (error) {
    return respond.failure(res, error)
  }
}
