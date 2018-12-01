const Joi = require('joi')

module.exports = (queryParams) => {
  return new Promise((resolve, reject) => {
    Joi.validate(queryParams, Joi.object().keys({
      'code': Joi.string().required()
    }), (error, value) => {
      if (error) reject(error)
      resolve(value)
    })
  })
}
