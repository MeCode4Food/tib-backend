const axios = require('axios')
const SIGNALE = require('signale')
const { VALVE_CARDSET_API_URL } = process.env

module.exports = (setNum) => {
  return new Promise(async (resolve, reject) => {
    try {
      const valveCardUrl = VALVE_CARDSET_API_URL + setNum
      axios.get(valveCardUrl)
        .then((response) => {
          let url = response.data.cdn_root.slice(0, -1) + response.data.url
          resolve(url)
        })
    } catch (error) {
      SIGNALE.error(error)
    }
  })
}
