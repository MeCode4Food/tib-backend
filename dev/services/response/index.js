const SIGNALE = require('signale') // Used for more readable CLI Logging

exports.success = (res, data) => {
  return sendResponse(res, 200, 'success', data)
}

exports.failure = (res, error) => {
  SIGNALE.error(error)
  if (error.name === 'NotFoundError') return sendResponse(res, 404, 'NOT_FOUND', error.message)
  if (error.name === 'EmptyPostgresResultsetError') return sendResponse(res, 1003, 'POSTGRES_EMPTY_CONTENT', error.message)
  return sendResponse(res, 500, 'INTERNAL_SERVER_ERROR', error.message) // Last kind of error to be caught will be this, which is why its at the end.
}

// ---- Supporting Methods ----
let sendResponse = (res, code, description, data) => {
  res.removeHeader('X-Powered-By')
  let payload = {
    'status': {
      'code': code,
      'description': description
    },
    'data': data
  }
  res.status(200).send(payload)
}
