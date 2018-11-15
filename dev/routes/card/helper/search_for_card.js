const knex = require(`${global.SERVER_ROOT}/services/knex`)
const SIGNALE = require('signale')

module.exports.searchForCard = async (query) => {
  try {
    let searchForCardQuery = knex.select()
      .from('cards')
      .where('card_name', 'like', `%${query}%`)
      .limit(1)

    console.log('query\n', searchForCardQuery.toString())

    let result = (await searchForCardQuery)[0]
    console.log('result\n', result)

    if (result.signature_id) {
      let searchForSignatureCard = knex.select()
        .from('cards')
        .where({
          card_id: result.signature_id
        })

      let signatureCard = (await searchForSignatureCard)[0]
      result.signature_name = signatureCard.card_name
      result.signature_text = signatureCard.card_text
    }

    if (result.passive_id) {
      let searchForPassiveCard = knex.select()
        .from('cards')
        .where({
          card_id: result.passive_id
        })

      let passiveCard = (await searchForPassiveCard)[0]
      result.passive_name = passiveCard.card_name
      result.passive_text = passiveCard.card_text
    }

    if (result.parent_id) {
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
  } catch (error) {
    SIGNALE.error(error)
  }
}

// TODO custom search keywords such as  bb = bristleback, blink = blink dagger
