const router = require('express').Router()
const knex = require('../../services/knex')
const respond = require(`${global.SERVER_ROOT}/services/response`)

router.get('/search', async (req, res) => {
  let searchQuery = req.query.query

  let query = knex
    .select()
    .from('users')
    .where(`name`, `like`, `%${searchQuery}%`)

  let results = await query

  respond.success(res, results)
})

router.put('/update', async (req, res) => {
  
})

module.exports = router
