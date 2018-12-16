const respond = require(`${global.SERVER_ROOT}/services/response`)
const knex = require(`${global.SERVER_ROOT}/services/knex`)
const { DB_USER_ACTIVITY, DB_USER_ONLINE_AVERAGE } = require(`${global.SERVER_ROOT}/helpers/variables`).DB_TABLES
const { ACTIVITY_ONLINE, ACTIVITY_OFFLINE, ACTIVITY_START_GAME, ACTIVITY_STOP_GAME } = require(`${global.SERVER_ROOT}/helpers/variables`).USER_ACTIVITIES
const SIGNALE = require('signale')
const chalk = require('chalk')

module.exports = async () => {
  try {
    
    let today = new Date()
    let todayDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
    let thisMorning = new Date(today.setHours(0, 0, 0, 0))

    let yesterday = new Date(today.setDate(today.getDate() - 1))
    let yesterdayDate = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`
    let yesterdayMorning = new Date(yesterday.setHours(0, 0, 0, 0))
    
    SIGNALE.info(`ETL job ${chalk.blue('online_averages')} running for day ${chalk.cyan(yesterdayDate)}`)

    let getTodaysActivityQuery = knex(DB_USER_ACTIVITY)
      .select()
      .where('timestamp', '>', yesterdayDate)
      .andWhere('timestamp', '<', todayDate)

    let results = await getTodaysActivityQuery

    let userActivityObj = {}

    // sort results into activities by user
    _.forEach(results, activityEvent => {
      // if userActivityObj does not have user_id as a key, create an empty object as its value
      if (!userActivityObj[activityEvent.user_id]) {
        userActivityObj[activityEvent.user_id] = {
          online_activity: [],
          game_activity: []
        }
      }

      if (
        activityEvent.activity === ACTIVITY_ONLINE ||
        activityEvent.activity === ACTIVITY_OFFLINE
      ) {
        userActivityObj[activityEvent.user_id].online_activity.push({
          timestamp: activityEvent.timestamp,
          activity: activityEvent.activity
        })
      }

      if (
        activityEvent.activity === ACTIVITY_START_GAME ||
        activityEvent.activity === ACTIVITY_STOP_GAME
      ) {
        userActivityObj[activityEvent.user_id].game_activity.push({
          timestamp: activityEvent.timestamp,
          activity: activityEvent.activity
        })
      }
    })

    // calculate hours by user
    let totalUsers = _.keys(userActivityObj).length
    let gamingUsers = 0
    let totalGamingHours = 0
    let totalOnlineHours = 0

    _.forEach(userActivityObj, (user) => {
      let onlineHoursPerUser = 0
      let gamingHoursPerUser = 0
      let hasStarted = false
      let startTime
      _.forEach(user.online_activity, (activityEvent, index) => {
        switch (activityEvent.activity) {
          case ACTIVITY_ONLINE:
            startTime = new Date(activityEvent.timestamp)
            hasStarted = true
            break
          case ACTIVITY_OFFLINE:
            let sessionDuration = hasStarted ? (activityEvent.timestamp - startTime) : (activityEvent.timestamp - yesterdayMorning)
            let sessionDurationHours = sessionDuration / (1000 * 60 * 60)
            onlineHoursPerUser += sessionDurationHours
            hasStarted = false
            break
          default:
            break
        }

        // missing ending offline activity or end of day
        if (index === user.online_activity.length - 1 && hasStarted) {
          let remainingDuration = thisMorning - startTime
          let remainingDurationHours = remainingDuration / (1000 * 60 * 60)
          onlineHoursPerUser += remainingDurationHours
          hasStarted = false
        }
      })

      _.forEach(user.game_activity, (activityEvent, index) => {
        switch (activityEvent.activity) {
          case ACTIVITY_START_GAME:
            startTime = activityEvent.timestamp
            hasStarted = true
            break
          case ACTIVITY_STOP_GAME:
            let sessionDuration = hasStarted ? (activityEvent.timestamp - startTime) : (activityEvent.timestamp - yesterdayMorning)
            let sessionDurationHours = sessionDuration / (1000 * 60 * 60)
            gamingHoursPerUser += sessionDurationHours
            hasStarted = false
            break
          default:
            break
        }

        // missing ending offline activity or end of day
        if (index === user.online_activity.length - 1 && hasStarted) {
          let remainingDuration = thisMorning - startTime
          let remainingDurationHours = remainingDuration / (1000 * 60 * 60)
          gamingHoursPerUser += remainingDurationHours
          hasStarted = false
        }
      })

      if (user.game_activity.length > 0) gamingUsers++
      totalOnlineHours += onlineHoursPerUser
      totalGamingHours += gamingHoursPerUser
    })

    let todayStats = {
      'online_hours': parseFloat(totalOnlineHours.toFixed(3)),
      'gaming_hours': parseFloat(totalGamingHours.toFixed(3)),
      'online_users': totalUsers,
      'gaming_users': gamingUsers
    }
    return respond.success(res, todayStats)
  } catch (error) {
    return respond.failure(res, error)
  }
}
