const validateCardSearch = require('./helper/validate_card_search')
const validateDeckDecode = require('./helper/validate_deck_decode')
const decodeDeckCode = require('./helper/get_decklist_from_deckcode')
const { searchForCard } = require('./helper/search_for_card')
const respond = require(`${global.SERVER_ROOT}/services/response`)

module.exports.getCardFromQuery = async (req, res) => {
  try {
    // validate body/params
    await validateCardSearch(req.query)

    // get params
    const query = req.query['query']

    // get card from db
    let result = await searchForCard(query)
    respond.success(res, result)
  } catch (error) {
    respond.failure(res, error)
  }
}

module.exports.getDeckFromCode = async (req, res) => {
  try {
    // validate params
    await validateDeckDecode(req.query)

    // get params
    const deckCode = req.query['code']

    // get card from db
    let result = await decodeDeckCode(deckCode)
    respond.success(res, result)
  } catch (error) {
    respond.failure(res, error)
  }
}
