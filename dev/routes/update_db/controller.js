// const knex = require('../../services/knex')
const respond = require(`${global.SERVER_ROOT}/services/response`)
const validate = require('./helpers/validate')
const getCardSetUrl = require('./helpers/get_cardset_url')
const getCardSetFromUrl = require('./helpers/get_cardset_from_url')
const updateCardDB = require('./helpers/update_card_db')

exports.retrieveCardSetAndUpdateDB = async (req, res) => {
  try {
    // validate body
    await validate(req.body)

    // get request params
    const setNum = req.body['set_num']

    // get url, call url, get json
    const url = await getCardSetUrl(setNum)
    const cardSet = await getCardSetFromUrl(url)
    await updateCardDB(cardSet)
    res.status(200).json({ status: cardSet })
  } catch (error) {
    respond.failure(res, error)
  }
}
