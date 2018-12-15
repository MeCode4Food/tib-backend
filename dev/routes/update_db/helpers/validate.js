const Joi = require('joi')
const { PassphraseError } = require(`${global.SERVER_ROOT}/services/response/error`)
const { API_SECRET } = process.env

module.exports = (queryObject) => {
  return new Promise((resolve, reject) => {
    Joi.validate(queryObject, Joi.object().keys({
      'set_num': Joi.string().required().valid(['00', '01']),
      'passphrase': Joi.string().required().valid([API_SECRET]).error(new PassphraseError())
    }), (error, value) => {
      if (error) reject(error)
      resolve(value)
    })
  })
}
