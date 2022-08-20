const { gql } = require('apollo-server');
const Book = require('../models/book');

const typeDef = gql`
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }
`;

const resolvers = {
  Author: {
    bookCount: async (root) => {
      return root.books.length;
    },
  },
};

module.exports = { typeDef, resolvers };
