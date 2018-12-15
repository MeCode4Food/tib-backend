const respond = require(`${global.SERVER_ROOT}/services/response`)
const recordUserActivity = require('./helpers/record_user_activity')
const validateNewActivity = require('./helpers/validate_new_activity')

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
