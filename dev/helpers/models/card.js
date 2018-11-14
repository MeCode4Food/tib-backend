class Card {
  constructor (object) {
    // id and date is optional for the constructor.
    // this is to facilitate new user creation (id should be incremented by the db)
    // and date will be created if there is none for new users
    this.card_id = object.card_id
    this.card_name = object.card_name.english
    this.card_type = object.card_type
    this.card_text = object.card_text.english
    this.card_image = object.large_image.default

    // assign colour based on is_X field
    if (object.is_blue === true) {
      this.colour = 'blue'
    } else if (object.is_red === true) {
      this.colour = 'red'
    } else if (object.is_green === true) {
      this.colour = 'green'
    } else if (object.is_black === true) {
      this.colour = 'black'
    } else {
      this.colour = 'none'
    }

    this.rarity = object.rarity

    // card relations
    this.signature_id = null
    this.parent_id = null
    this.passive_id = null
    this.active_id = null
    this.reference_id = null

    if (object.card_type === 'Hero') {
      for (var ref in object.references) {
        switch (ref.ref_type) {
          case 'includes':
            this.signature = ref.card_id
            break
          case 'passive_ability':
            this.passive_id = ref.card_id
            break
          case 'active_ability':
            this.active_id = ref.card_id
            break
          default:
            break
        }
      }
    } else if (object.references[0].ref_type === 'references') {
      this.reference_id = object.references[0].card_id
    }

    // card stats
    this.attack = object.attack
    this.armour = object.armour
    this.hit_points = object.hit_points
    this.mana_cost = object.mana_cost
    this.gold_cost = object.gold_cost
  }
}

module.exports = Card
