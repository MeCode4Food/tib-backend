// ------- AccessTokenError Error class -------
exports.NotFoundError = class NotFoundError extends Error {
  constructor (message) {
    super()
    this.name = this.constructor.name
    this.message = 'API endpoint with specified HTTP method does not exist.'
  }
}

// ------- AccessTokenError Error class -------
exports.EmptyMySQLResultsetError = class EmptyMySQLResultsetError extends Error {
  constructor (message) {
    super()
    this.name = this.constructor.name
    this.message = 'MySQL resultset is empty.'
  }
}
