const { gql } = require('apollo-server');

const typeDef = gql`
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }
`;

module.exports = { typeDef };
