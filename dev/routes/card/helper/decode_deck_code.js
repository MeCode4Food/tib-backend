const deckDecoder = require('./decoder')
const knex = require(`${global.SERVER_ROOT}/services/knex`)
const _ = require('lodash')

module.exports = async (deckCode) => {
  let deckObjectRaw = deckDecoder.ParseDeck(deckCode)

  let cardIdArray = []
  let totalCardIds = deckObjectRaw.heroes.length + deckObjectRaw.cards.length
  let idToDelete = []

  // loop through heroes and cards to get card_id and put all of them into array cardIdArray
  _.forEach(deckObjectRaw.heroes, (stack) => {
    cardIdArray.push(stack.id)
  })

  _.forEach(deckObjectRaw.cards, (stack) => {
    cardIdArray.push(stack.id)
  })

  let deckCardsQuery = knex
    .select()
    .from(`cards`)
    .whereIn(`card_id`, cardIdArray)

  let results = await deckCardsQuery
  if (results.length !== totalCardIds) { throw new Error('Please check the the deck code') }

  // create a map to avoid searching through array
  let resultsMap = {}

  _.forEach(results, (card) => {
    resultsMap[card.card_id] = card
  })

  // loop through each object in heroes. append card info to the stack
  _.forEach(deckObjectRaw.heroes, (stack) => {
    stack.card_id = stack.id
    delete stack.id

    stack.name = resultsMap[stack.card_id].card_name
    stack.colour = resultsMap[stack.card_id].colour
  })

  // do the same for cards
  _.forEach(deckObjectRaw.cards, (stack) => {
    stack.card_id = stack.id
    delete stack.id

    if (resultsMap[stack.card_id].card_type === 'Item') {
      // create item section if it does not exist
      if (!deckObjectRaw.items) deckObjectRaw.items = []

      // push item into item array in new item section
      deckObjectRaw.items.push({
        card_id: stack.card_id,
        card_name: resultsMap[stack.card_id].card_name,
        count: stack.count
      })

      idToDelete.push(stack.card_id)
    } else {
      stack.name = resultsMap[stack.card_id].card_name
    }
  })

  // remove the stack from cards that has the card_id in items
  _.remove(deckObjectRaw.cards, (stack) => {
    let result = _.indexOf(idToDelete, stack.card_id)
    return result >= 0
  })

  return deckObjectRaw
}
