const axios = require('axios')

module.exports = (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      axios.get(url)
        .then((response) => {
          resolve(response.data.card_set.card_list)
        })
    } catch (error) {
      reject(error)
    }
  })
}
