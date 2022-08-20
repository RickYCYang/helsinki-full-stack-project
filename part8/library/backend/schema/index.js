const _ = require('lodash');

/** GraphQL schema */
const { typeDef: Author, resolvers: authorResolvers } = require('./author');
const { typeDef: Book } = require('./book');
const { typeDef: User } = require('./user');
const { typeDef: Token } = require('./token');
const { typeDef: Query, resolvers: queryResolvers } = require('./query');
const {
  typeDef: Mutation,
  resolvers: mutationResolvers,
} = require('./mutation');
const {
  typeDef: Subscription,
  resolvers: subscriptionResolvers,
} = require('./subcription');

const typeDefs = [Author, Book, User, Token, Query, Mutation, Subscription];
const resolvers = _.merge(
  authorResolvers,
  queryResolvers,
  mutationResolvers,
  subscriptionResolvers
);

module.exports = { typeDefs, resolvers };
