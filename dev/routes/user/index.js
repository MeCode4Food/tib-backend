const router = require('express').Router()
const knex = require('../../services/knex')

router.get('/', async (req, res) => {
  let results = await knex
    .select()
    .from('users')

  res.status(200).send('Hello World!' + results)
})
module.exports = router
