const knex = require(`${global.SERVER_ROOT}/services/knex`)
const SIGNALE = require('signale')
const chalk = require('chalk')
const Card = require(`${global.SERVER_ROOT}/helpers/models/card`)

module.exports = (cardSet) => {
  return new Promise(async (resolve, reject) => {
    //     INSERT INTO `cards` ( `armour`, `attack`, `card_id`, `card_image`, `card_name`, `card_text`, `card_type`, `colour`, `gold_cost`, `hit_points`, `mana_cost`, `rarity`, `signature_id`)
    // VALUES ( , , , '', '', '', '', '', , , , '',  );
    try {
      let cardList = cardSet
      let childMap = {} // map child cards (id) to parent cards (id)
      let cardCount = 0
      SIGNALE.info('Putting cards from card list into DB')

      for (let i = 0; i < cardList.length; i++) {
        let newCard = new Card(cardList[i])
        SIGNALE.info(`Updating card ${chalk.cyan(newCard.card_name)}`)
        let insertNewCardQuery = knex.raw(`
          INSERT INTO cards (
            card_id,
            card_name,
            card_type,
            card_text,
            card_image,
            card_icon,
            colour,
            rarity,
            signature_id,
            parent_id,
            passive_id,
            active_id,
            reference_id,
            attack,
            armour,
            hit_points,
            mana_cost,
            gold_cost 
          )
          VALUES (
            :card_id,
            :card_name,
            :card_type,
            :card_text,
            :card_image,
            :card_icon,
            :colour,
            :rarity,
            :signature_id,
            :parent_id,
            :passive_id,
            :active_id,
            :reference_id,
            :attack,
            :armour,
            :hit_points,
            :mana_cost,
            :gold_cost
          )
          ON DUPLICATE KEY UPDATE
            card_id = :card_id,
            card_name = :card_name,
            card_type = :card_type,
            card_text = :card_text,
            card_image = :card_image,
            card_icon = :card_icon,
            colour = :colour,
            rarity = :rarity,
            signature_id = :signature_id,
            parent_id = :parent_id,
            passive_id = :passive_id,
            active_id = :active_id,
            reference_id = :reference_id,
            attack = :attack,
            armour = :armour,
            hit_points = :hit_points,
            mana_cost = :mana_cost,
            gold_cost = :gold_cost
          `,
        {
          'card_id': newCard.card_id,
          'card_name': newCard.card_name,
          'card_type': newCard.card_type,
          'card_text': newCard.card_text,
          'card_image': newCard.card_image,
          'card_icon': newCard.card_icon,
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
        if (newCard.reference_id && newCard.reference_id >= 10000) childMap[newCard.reference_id] = newCard.card_id

        cardCount++
      }

      SIGNALE.success(`Loaded ${chalk.cyan(cardCount)} cards from official card set into DB`)
      SIGNALE.info('Resolving card dependencies')
      cardCount = 0
      // assign parent id to child cards using knex update
      for (let index = 0; index < Object.keys(childMap).length; index++) {
        let childId = Object.keys(childMap)[index]
        let updateChildCardParentQuery = knex('cards').update({
          'parent_id': childMap[childId]
        }).where({
          'card_id': childId
        })

        SIGNALE.info(`Updating parent id ${chalk.cyan(childMap[childId])} for child id ${chalk.cyan(childId)}`)
        await updateChildCardParentQuery
        cardCount++
      }
      SIGNALE.success(`Resolved ${chalk.cyan(cardCount)} card dependencies in DB`)
      resolve(true)
    } catch (error) {
      SIGNALE.error(error)
    }
  })
}
