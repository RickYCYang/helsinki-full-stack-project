const { gql } = require('apollo-server');
const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();

const typeDef = gql`
  type Subscription {
    bookAdded: Book!
  }
`;

//pubsub.publish('BOOK_ADDED', { bookAdded: book });
const resolvers = {
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
    },
  },
};

module.exports = { typeDef, resolvers, pubsub };
