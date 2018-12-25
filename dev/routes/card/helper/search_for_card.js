const knex = require(`${global.SERVER_ROOT}/services/knex`)
const { EmptyMySQLResultsetError } = require(`${global.SERVER_ROOT}/services/response/error`)
// const SIGNALE = require('signale')

module.exports.searchForCard = async (query) => {
  let tries = 5
  let searchForCardQuery = knex.select('*', knex.raw(`(CASE WHEN card_type <> 'Ability' THEN 1 ELSE 0 END) as isNotAbility`))
    .from('cards')
    .where('card_name', 'LIKE', `%${query}%`)
    .whereNot({ 'card_type': 'Passive Ability' })
    .whereNot({ 'card_type': 'Pathing' })
    .whereNot({ 'card_type': 'Stronghold' })
    .orderByRaw('LENGTH(card_name) ASC, isNotAbility DESC')
    .limit(1)

  // execute query
  let result = (await searchForCardQuery)[0]

  // do over once again if there is no result or tries is 0
  while (!result && tries) {
    try {
      result = (await searchForCardQuery)[0]
    } catch (error) {
      if (!tries && !error.message.endsWith('ECONNRESET')) throw error
    } finally {
      tries--
    }
  }

  if (tries === 0) throw new EmptyMySQLResultsetError()

  // append card dependencies
  result = await appendCardDependencies(result)

  return result
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

  if (result && result.active_id) {
    let searchForActiveCard = knex.select()
      .from('cards')
      .where({
        card_id: result.active_id
      })

    let activeCard = (await searchForActiveCard)[0]
    result.active_name = activeCard.card_name
    result.active_text = activeCard.card_text
  }

  // if (result && result.parent_id) {
  //   let searchForParentCard = knex.select()
  //     .from('cards')
  //     .where({
  //       card_id: result.parent_id
  //     })

  //   let parentCard = (await searchForParentCard)[0]
  //   result.parent_name = parentCard.card_name
  //   result.parent_type = parentCard.card_type
  //   result.colour = parentCard.colour
  // }

  return result
}
