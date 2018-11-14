const knex = require(`${global.SERVER_ROOT}/services/knex`)
const Card = require(`${global.SERVER_ROOT}/helpers/models/card`)

module.exports = (cardSet) => {
  return new Promise(async (resolve, reject) => {
    //     INSERT INTO `cards` ( `armour`, `attack`, `card_id`, `card_image`, `card_name`, `card_text`, `card_type`, `colour`, `gold_cost`, `hit_points`, `mana_cost`, `rarity`, `signature_id`)
    // VALUES ( , , , '', '', '', '', '', , , , '',  );
    try {
      let cardList = cardSet.card_list
      // map child cards (id) to parent cards (id)
      let childMap = {}

      for (var card in cardList) {
        let newCard = new Card(card)
        console.log('card\n', newCard)
        let insertNewCardQuery = knex('users').insert({
          'card_id': newCard.card_id,
          'card_name': newCard.card_name,
          'card_type': newCard.card_type,
          'card_text': newCard.card_text,
          'card_image': newCard.card_image,
          'colour': newCard.colour,
          'rarity': newCard.rarity,
          'signature_id': newCard.signature_id,
          'parent_id': newCard.parent_id,
          'passive_id': newCard.passive_id,
          'active_id': newCard.active_id,
          'reference_id': newCard.reference_id,
          'attack': newCard.attack,
          'armour': newCard.armour,
          'hit_points': newCard.hit_points,
          'mana_cost': newCard.mana_cost,
          'gold_cost': newCard.gold_cost
        })

        await insertNewCardQuery

        // assign child card id to parent card id
        if (newCard.signature_id) childMap[newCard.signature_id] = newCard.card_id
        if (newCard.passive_id) childMap[newCard.passive_id] = newCard.card_id
        if (newCard.active_id) childMap[newCard.active_id] = newCard.card_id
        if (newCard.reference_id) childMap[newCard.reference_id] = newCard.card_id
      }

      // assign parent id to child cards using knex update
      for (var childId in Object.keys(childMap)) {
        let updateChildCardParent = knex('cards').update({
          'parent_id': childMap[childId]
        }).where({
          'card_id': childId
        })

        await updateChildCardParent
      }
    } catch (error) {
      reject(error)
    }
  })
}
