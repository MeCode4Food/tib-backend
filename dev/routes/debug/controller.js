// const knex = require('../../services/knex')
const respond = require(`${global.SERVER_ROOT}/services/response`)
const nightmare = require(`${global.SERVER_ROOT}/services/nightmare`)

exports.runNightmare = async (req, res) => {
  try {
    let results = {}
    nightmare
      .goto('https://learnartifact.com/cards')
      .click('.class>.button showall')
      .wait('')
    respond.success(res, results)
  } catch (error) {
    respond.failure(res, error)
  }
}
