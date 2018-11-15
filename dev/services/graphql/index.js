const graphql = require('express-graphql')
const { buildSchema } = require('graphql')

// GraphQL Schema
// TODO seperate this schema into models/graphql/user
const schema = buildSchema(`
  type Query {
    card_name: String,
    card_text: String
  },
  type Course {
    id: Int
    title: String
    author: String
    description: String
    topic: String
    url: String
  }
`)

// Root Resolver
const root = {
  card_name: () => 'Hello',
  card_text: () => 'World!'
}

module.exports = graphql({
  schema: schema,
  rootValue: root,
  graphiql: true
})
