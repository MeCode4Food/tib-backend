const knex = require(`${global.SERVER_ROOT}/services/knex`)
const { EmptyMySQLResultsetError } = require(`${global.SERVER_ROOT}/services/response/error`)
// const SIGNALE = require('signale')

module.exports.searchForCard = async (query) => {
  try {
    let searchForCardQuery = knex.select()
      .from('cards')
      .where('card_name', 'like', `%${query}%`)
      .whereNot({ 'card_type': 'Passive Ability' })
      .whereNot({ 'card_type': 'Pathing' })
      .whereNot({ 'card_type': 'Stronghold' })
      .limit(1)

    // execute query
    let result = (await searchForCardQuery)[0]

    if (result) {
      // append card dependencies
      result = await appendCardDependencies(result)
    } else {
      throw new EmptyMySQLResultsetError()
    }
    return result
  } catch (error) {
    throw error
  }
}

let appendCardDependencies = async function (result) {
  if (result && result.signature_id) {
    let searchForSignatureCard = knex.select()
      .from('cards')
      .where({
        card_id: result.signature_id
      })

    let signatureCard = (await searchForSignatureCard)[0]
    result.signature_name = signatureCard.card_name
    result.signature_text = signatureCard.card_text
  }

  if (result && result.passive_id) {
    let searchForPassiveCard = knex.select()
      .from('cards')
      .where({
        card_id: result.passive_id
      })

    let passiveCard = (await searchForPassiveCard)[0]
    result.passive_name = passiveCard.card_name
    result.passive_text = passiveCard.card_text
  }

  if (result && result.parent_id) {
    let searchForParentCard = knex.select()
      .from('cards')
      .where({
        card_id: result.parent_id
      })

    let passiveCard = (await searchForParentCard)[0]
    result.parent_name = passiveCard.card_name
    result.parent_type = passiveCard.card_type
  }

  return result
}
