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

  // loop through each object in heroes. alter the stack and remap it to the source
  deckObjectRaw.heroes = _.map(deckObjectRaw.heroes, (stack) => {
    const id = stack.id
    const turn = stack.turn

    stack = resultsMap[id]
    stack.turn = turn

    return stack
  })

  deckObjectRaw.heroes = _.sortBy(deckObjectRaw.heroes, (hero) => { return hero.turn })

  // do the same for cards
  deckObjectRaw.cards = _.map(deckObjectRaw.cards, (stack) => {
    const id = stack.id
    const count = stack.count

    if (resultsMap[id].card_type === 'Item') {
      // create item section if it does not exist
      if (!deckObjectRaw.items) deckObjectRaw.items = []

      // push item into item array in new item section
      resultsMap[id].count = count
      deckObjectRaw.items.push(resultsMap[id])

      idToDelete.push(id)
      return stack
    } else {
      resultsMap[id].count = count
      stack = resultsMap[id]

      return stack
    }
  })

  // remove the stack from cards that has the card_id in items
  _.remove(deckObjectRaw.cards, (stack) => {
    let result = _.indexOf(idToDelete, stack.id)
    return result >= 0
  })

  return deckObjectRaw
}
