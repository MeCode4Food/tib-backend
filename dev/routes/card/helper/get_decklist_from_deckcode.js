const deckDecoder = require('./deckcode_decoder')
const knex = require(`${global.SERVER_ROOT}/services/knex`)
const _ = require('lodash')

module.exports = async (deckCode) => {
  let deckObjectRaw = deckDecoder.ParseDeck(deckCode)

  let heroCount = {}
  let cardIdArray = []
  let idToDelete = []

  // loop through heroes and cards to get card_id and put all of them into array cardIdArray
  _.forEach(deckObjectRaw.heroes, (stack) => {
    cardIdArray.push(stack.id)
    heroCount[stack.id] = heroCount[stack.id] ? heroCount[stack.id] + 1 : 1
  })

  let heroCardsQuery = knex
    .select()
    .from(`cards`)
    .whereIn(`card_id`, cardIdArray)

  let heroCards = await heroCardsQuery

  _.forEach(heroCards, (heroCard) => {
    cardIdArray.push(heroCard.signature_id)
    deckObjectRaw.cards.push({ id: heroCard.signature_id, count: 3 * heroCount[heroCard.card_id] })
  })

  _.forEach(deckObjectRaw.cards, (stack) => {
    cardIdArray.push(stack.id)
  })

  deckObjectRaw.cards = _.orderBy(deckObjectRaw.cards, 'desc')
  // for cards, make sure that there are no repeat card_id's. take the one with the highest count if encountered.
  deckObjectRaw.cards = _.uniqBy(deckObjectRaw.cards, 'id')

  let deckCardsQuery = knex
    .select()
    .from(`cards`)
    .whereIn(`card_id`, cardIdArray)

  let results = await deckCardsQuery

  // create a map to avoid searching through array
  let resultsMap = {}

  _.forEach(results, (card) => {
    resultsMap[card.card_id] = card
  })

  // loop through each object in heroes. alter the stack and remap it to the source
  deckObjectRaw.heroes = _.map(deckObjectRaw.heroes, (stack) => {
    const id = stack.id
    const turn = stack.turn

    Object.assign(stack, resultsMap[id])
    stack.turn = turn

    console.log(stack.card_id, stack.turn)
    return stack
  })

  deckObjectRaw.heroes = _.sortBy(deckObjectRaw.heroes, (hero) => { return hero.turn })

  console.log(deckObjectRaw.heroes)

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

  deckObjectRaw.cards = _.sortBy(deckObjectRaw.cards, [
    (card) => { return card.mana_cost },
    (card) => { return card.colour },
    (card) => { return card.card_name }
  ])

  deckObjectRaw.items = _.sortBy(deckObjectRaw.items, [
    (item) => { return item.gold_cost },
    (item) => { return item.card_name }
  ])

  return deckObjectRaw
}
