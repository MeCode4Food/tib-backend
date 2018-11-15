const axios = require('axios')
const SIGNALE = require('signale')

module.exports = (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      axios.get(url)
        .then((response) => {
          resolve(response.data.card_set.card_list)
        })
    } catch (error) {
      SIGNALE.error(error)
    }
  })
}
