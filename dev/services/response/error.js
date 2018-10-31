// ------- AccessTokenError Error class -------
exports.NotFoundError = class NotFoundError extends Error {
  constructor (message) {
    super()
    this.name = this.constructor.name
    this.message = 'API endpoint with specified HTTP method does not exist.'
  }
}

// ------- AccessTokenError Error class -------
exports.EmptyPostgresResultsetError = class EmptyPostgresResultsetError extends Error {
  constructor (message) {
    super()
    this.name = this.constructor.name
    this.message = 'Postgres resultset is empty.'
  }
}
