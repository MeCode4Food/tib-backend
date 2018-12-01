const deckDecoder = require('./decoder')

module.exports = async (deckCode) => {
  let deckObjectRaw = deckDecoder.ParseDeck(deckCode)

  return deckObjectRaw
}
