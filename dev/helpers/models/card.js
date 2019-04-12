const { replaceHTMLwithMD } = require('./helper/card_text_formatter')

class Card {
  constructor (object) {
    // id and date is optional for the constructor.
    // this is to facilitate new user creation (id should be incremented by the db)
    // and date will be created if there is none for new users
    this.card_id = object.card_id
    this.card_name = object.card_name.english
    this.card_type = object.card_type
    this.card_text = object.card_text.english ? replaceHTMLwithMD(object.card_text.english) : null
    this.card_image = object.large_image.default ? object.large_image.default : null
    this.card_icon = object.ingame_image.default ? object.ingame_image.default : null

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

    this.rarity = object.rarity ? object.rarity : null

    // card relations
    this.signature_id = null
    this.parent_id = null
    this.passive_id = null
    this.active_id = null
    this.reference_id = null

    object.references.forEach(function (ref) {
      switch (ref.ref_type) {
        case 'includes':
          this.signature_id = ref.card_id
          break
        case 'passive_ability':
          this.passive_id = ref.card_id
          break
        case 'active_ability':
          this.active_id = ref.card_id
          break
        case 'references':
          this.reference_id = ref.card_id
          break
        default:
          break
      }
    }.bind(this))

    // card stats
    this.attack = object.attack ? object.attack : null
    this.armour = object.armor ? object.armor : null
    this.hit_points = object.hit_points ? object.hit_points : null
    this.mana_cost = object.mana_cost ? object.mana_cost : null
    this.gold_cost = object.gold_cost ? object.gold_cost : null
    this.charges = object.charges ? object.charges : null
  }
}

module.exports = Card
