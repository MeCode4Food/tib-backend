const knex = require(`${global.SERVER_ROOT}/services/knex`)
const { DB_USER_ACTIVITY, DB_USER_ONLINE_AVERAGES } = require(`${global.SERVER_ROOT}/helpers/variables`).DB_TABLES
const { ACTIVITY_ONLINE, ACTIVITY_OFFLINE, ACTIVITY_START_GAME, ACTIVITY_STOP_GAME } = require(`${global.SERVER_ROOT}/helpers/variables`).USER_ACTIVITIES
const { MIN_ACTIVITY_DURATION_HOURS } = require('../etl_variables')
const uuidv4 = require('uuid/v4')
const SIGNALE = require('signale')
const chalk = require('chalk')
const _ = require('lodash')
const CronJob = require('cron').CronJob

module.exports = async () => {
  etlJob.start()
}

const etlJob = new CronJob('00 05 16 * * *', async () => {
  SIGNALE.info(`ETL Job ${chalk.blue('etl_online_averages')} started`)

  try {
    let today = new Date()
    let todayDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
    let thisMorning = new Date(today.setHours(0, 0, 0, 0))

    let yesterday = new Date(today.setDate(today.getDate() - 1))
    let yesterdayDate = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`
    let yesterdayMorning = new Date(yesterday.setHours(0, 0, 0, 0))

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

    // variables for calculating averages
    let totalUsers = _.keys(userActivityObj).length
    let totalGamers = 0

    let activeUsers = 0
    let activeGamers = 0

    let totalGamingHours = 0
    let totalActiveGamingHours = 0

    let totalOnlineHours = 0
    let totalActiveOnlineHours = 0

    let isActive = false
    let isGamer = false

    // calculate hours by user
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
        if (index === user.game_activity.length - 1 && hasStarted) {
          let remainingDuration = thisMorning - startTime
          let remainingDurationHours = remainingDuration / (1000 * 60 * 60)
          gamingHoursPerUser += remainingDurationHours
          hasStarted = false
        }
      })

      totalGamers += user.game_activity.length > 0 ? 1 : 0

      // to decide whether to add data into DB for less active users
      isActive = onlineHoursPerUser > MIN_ACTIVITY_DURATION_HOURS
      totalOnlineHours += onlineHoursPerUser
      totalActiveOnlineHours += isActive ? onlineHoursPerUser : 0
      activeUsers += isActive ? 1 : 0

      isGamer = gamingHoursPerUser > MIN_ACTIVITY_DURATION_HOURS
      totalGamingHours += gamingHoursPerUser
      totalActiveGamingHours += isGamer ? gamingHoursPerUser : 0
      activeGamers += isGamer ? 1 : 0
    })

    let todayStats = {
      id: uuidv4(),
      date: yesterdayDate,
      total_online_hours: totalOnlineHours,
      total_gaming_hours: totalGamingHours,
      active_online_hours: totalActiveOnlineHours,
      active_gaming_hours: totalActiveGamingHours,
      total_users: totalUsers,
      total_gamers: totalGamers,
      active_users: activeUsers,
      active_gamers: activeGamers
    }

    // update user_online_averages
    let updateAveragesQuery = knex(DB_USER_ONLINE_AVERAGES)
      .insert(todayStats)

    await updateAveragesQuery
  } catch (error) {
    throw error
  } finally {
    SIGNALE.start(`ETL Job ${chalk.blue('etl_online_averages')} ended successfully`)
  }
})
