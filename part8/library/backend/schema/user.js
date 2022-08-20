const { gql } = require('apollo-server');

const typeDef = gql`
  type User {
    username: String!
    favouriteGenre: String!
    id: ID!
  }
`;

module.exports = { typeDef };
