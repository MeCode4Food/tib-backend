const mysql = require('mysql')
const { DEV_MYSQL_DATABASE_USERNAME, DEV_MYSQL_DATABASE_PASSWORD, DEV_MYSQL_DATABASE_PORT, DEV_MYSQL_DATABASE_DBNAME, DEV_MYSQL_DATABASE_URL } = process.env

// const url =
const connection = mysql.createConnection({
  host: DEV_MYSQL_DATABASE_URL + ':' + DEV_MYSQL_DATABASE_PORT,
  user: DEV_MYSQL_DATABASE_USERNAME,
  password: DEV_MYSQL_DATABASE_PASSWORD,
  database: DEV_MYSQL_DATABASE_DBNAME
})

try {
  connection.connect()
} catch (e) {
  console.log('Database Connection failed:' + e)
}

module.exports = connection
