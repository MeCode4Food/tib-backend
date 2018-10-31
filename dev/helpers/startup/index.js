const knex = require('../../services/knex')
module.exports.setupDB = async () => {
  await initMySQLTables()
}

module.exports.getWebAppAPI = () => {
  return require(`${global.SERVER_ROOT}/routes`)
}

let initMySQLTables = async function () {
  // let results = await knex
  //   .select()
  //   .from('users')

  // console.log(results)
}
