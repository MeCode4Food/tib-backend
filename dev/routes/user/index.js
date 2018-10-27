const router = require('express').Router()
const _response = require('../models/response')
const User = require('../models/user')
const async = require('async')

router.get('/:id', (req, res) => {
  let id
  id = parseInt(req.params.id, 10)

  if (isNaN(id)) {
    res.status(400).json(_response.error_bad_request)
    return
  }

  async.waterfall([
    function queryDatabase (callback) {
      req.getConnection(function (err, conn) {
        if (err) callback(_response.err, null)

        conn.query('SELECT * FROM users WHERE id = ' + req.params.id, [], function (err, rows) {
          if (err) callback(err, null)
          else {
            if (rows.length < 1) {
              let response = _response.success
              response.message = rows
              callback(null, response)
              // callback(null, _response.success_user_not_found);
            } else {
              let response = _response.success
              response.message = rows
              callback(null, response)
            }
          }
        })
      })
    }
  ], function handleErrors (err, result) {
    if (err) res.status(400).json(err)
    else res.status(200).json(result)
  })
})

// GET all users or query by email
router.get('/', (req, res) => {
  let queryString
  let queryArgs

  if (req.query.email !== undefined) {
    queryString = 'WHERE email = ?'
    queryArgs = req.query.email
  } else if (Object.keys(req.query) === 0) {
    queryString = ''
    queryArgs = []
  }

  async.waterfall([
    function queryDatabase (callback) {
      req.getConnection(function (err, conn) {
        if (err) callback(_response.err, null)

        conn.query('SELECT * FROM users ' + queryString, queryArgs, function (err, rows) {
          if (err) callback(err, null)
          else {
            if (rows.length < 1) {
              callback(null, _response.success_user_not_found)
            } else {
              let response = _response.success
              response.message = rows
              callback(null, response)
            }
          }
        })
      })
    }
  ], function handleErrors (err, result) {
    if (err) res.status(400).json(err)
    else res.status(200).json(result)
  })
})

router.post('/', (req, res) => {
  let userArray = []
  let userSingle
  let isMultiInput = false
  let queryString = ''
  let queryArgs = []

  if (req.body.data === undefined) {
    res.status(400).json(_response.error_bad_request)
    return
  }

  if (Array.isArray(req.body.data)) {
    isMultiInput = true
    req.body.data.forEach(function (user) {
      userSingle = new User(user)
      userArray.push(userSingle)
    })
  } else {
    userSingle = new User(req.body.data)
  }

  if (isMultiInput) {
    userArray.forEach((element, index) => {
      if (element.name && element.email && element.points) {
        queryString += '( ?, ?, ? )'
        queryArgs.push(element.name)
        queryArgs.push(element.email)
        queryArgs.push(element.points)
      }

      if (index !== userArray.length) {
        queryString += ', '
      }
    })
  } else {
    queryString += '( ?, ?, ? )'
    queryArgs.push(userSingle.name)
    queryArgs.push(userSingle.email)
    queryArgs.push(userSingle.points) // no points
  }

  async.waterfall([
    function queryDatabase (callback) {
      req.getConnection(function (err, conn) {
        if (err) callback(_response.err, null)

        conn.query('INSERT INTO users(name, email, points) VALUES ' + queryString, queryArgs, function (err, rows) {
          if (err) callback(err, null)
          else {
            if (rows.length < 1) {
              callback(null, _response.success_user_not_found)
            } else {
              let response = _response.success
              response.message = rows
              callback(null, response)
            }
          }
        })
      })
    }
  ], function handleErrors (err, result) {
    if (err) res.status(400).json(err)
    else res.status(200).json(result)
  })
})

router.put('/:id', (req, res) => {
  let queryArgs = []

  if (req.params.id === undefined) {
    res.status(400).json(_response.error_bad_request)
    req.body.data.id = req.params.id
    return
  }

  let userSingle = new User(req.body.data)

  queryArgs.push(userSingle.name)
    .push(userSingle.email)
    .push(userSingle.points)
    .push(userSingle.id)

  async.waterfall([
    function queryDatabase (callback) {
      req.getConnection(function (err, conn) {
        if (err) callback(_response.err, null)

        conn.query('UPDATE users set name = ? , email = ?, points = ? WHERE id = ?', queryArgs, function (err, rows) {
          if (err) callback(err, null)
          else {
            if (rows.length < 1) {
              callback(null, _response.success_user_not_found)
            } else {
              let response = _response.success
              response.message = rows
              callback(null, response)
            }
          }
        })
      })
    }
  ], function handleErrors (err, result) {
    if (err) res.status(400).json(err)
    else res.status(200).json(result)
  })
})

router.delete('/:id', function (req, res) {
  let id = req.params.id
  let queryArgs = []
  queryArgs.push(id)

  async.waterfall([
    function queryDatabase (callback) {
      req.getConnection(function (err, conn) {
        if (err) callback(_response.err, null)

        conn.query('DELETE FROM users WHERE id = ?', queryArgs, function (err, rows) {
          if (err) callback(err, null)
          else {
            if (rows.length < 1) {
              callback(null, _response.success_user_not_found)
            } else {
              let response = _response.success
              response.message = rows
              callback(null, response)
            }
          }
        })
      })
    }
  ], function handleErrors (err, result) {
    if (err) res.status(400).json(err)
    else res.status(200).json(result)
  })
})

module.exports = router
