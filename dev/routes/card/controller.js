const validate = require('./helper/validate')
const { searchForCard } = require('./helper/search_for_card')
const respond = require(`${global.SERVER_ROOT}/services/response`)

module.exports.getCardFromQuery = async (req, res) => {
  try {
    // validate body/params
    await validate(req.query)

    // get params
    const query = req.query['query']

    // get card from db
    let result = await searchForCard(query)
    respond.success(res, result)
  } catch (error) {
    respond.failure(res, error)
  }
}
