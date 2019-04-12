const Joi = require('joi')
const { PassphraseError } = require(`${global.SERVER_ROOT}/services/response/error`)
const { API_SECRET } = process.env

module.exports = (queryObject) => {
  return new Promise((resolve, reject) => {
    Joi.validate(queryObject, Joi.object().keys({
      'timestamp': Joi.string().isoDate(),
      'online': Joi.number().integer().positive(),
      'in_game': Joi.number().integer().positive(),
      'total': Joi.number().integer().positive(),
      'secret': Joi.string().required().valid([API_SECRET]).error(new PassphraseError())
    }), (error, value) => {
      if (error) reject(error)
      resolve(value)
    })
  })
}
