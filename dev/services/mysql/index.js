const { DEV_MYSQL_DATABASE_USERNAME, DEV_MYSQL_DATABASE_PASSWORD, DEV_MYSQL_DATABASE_PORT, DEV_MYSQL_DATABASE_DBNAME, DEV_MYSQL_DATABASE_URL } = process.env

const hostname = DEV_MYSQL_DATABASE_URL + ':' + DEV_MYSQL_DATABASE_PORT
// const url =
const config = {
  client: 'mysql',
  connection: {
    host: hostname,
    user: DEV_MYSQL_DATABASE_USERNAME,
    password: DEV_MYSQL_DATABASE_PASSWORD,
    database: DEV_MYSQL_DATABASE_DBNAME
  }
}

module.exports.config = config
