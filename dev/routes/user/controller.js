const knex = require('../../services/knex')
const respond = require(`${global.SERVER_ROOT}/services/response`)
const { EmptyMySQLResultsetError } = require(`${global.SERVER_ROOT}/services/response/error`)

exports.getCardByName = async (req, res) => {
  try {
    let searchQuery = req.query.query

    let query = knex
      .select()
      .from('users')
      .where(`name`, `like`, `%${searchQuery}%`)

    let results = await query
    if (results.length <= 0) throw new EmptyMySQLResultsetError()

    return respond.success(res, results)
  } catch (error) {
    return respond.failure(res, error)
  }
}

exports.updateCardDBUsingJSONFile = async (req, res) => {
  try {
    const cardJson = require(`${global.SERVER_ROOT}../../cards.json`)

    return respond.success(res, cardJson)
  } catch (error) {
    return respond.failure(res, error)
  }
}
