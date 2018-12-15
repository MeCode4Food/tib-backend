const Joi = require('joi')
const { PassphraseError } = require(`${global.SERVER_ROOT}/services/response/error`)
const { API_PASSPHRASE } = process.env

module.exports = (queryObject) => {
  return new Promise((resolve, reject) => {
    Joi.validate(queryObject, Joi.object().keys({
      'user_id': Joi.string().required(),
      'date': Joi.string().isoDate(),
      'activity': Joi.string().valid(['user_online', 'user_offline', 'user_start_game', 'user_stop_game']),
      'secret': Joi.string().required().valid([API_PASSPHRASE]).error(new PassphraseError())
    }), (error, value) => {
      if (error) reject(error)
      resolve(value)
    })
  })
}
