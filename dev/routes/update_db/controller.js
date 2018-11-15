// const knex = require('../../services/knex')
const respond = require(`${global.SERVER_ROOT}/services/response`)
const SIGNALE = require('signale')
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
    SIGNALE.success('Retrieved card set url from official API')
    const cardSet = await getCardSetFromUrl(url)
    SIGNALE.success('Retrieved card set from official API url')
    let result = await updateCardDB(cardSet)

    if (result) res.status(200).json({ status: 'OK' })
  } catch (error) {
    respond.failure(res, error)
  }
}
