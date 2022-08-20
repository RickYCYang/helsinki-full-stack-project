const config = require('../utils/config');

const { gql } = require('apollo-server');
const { UserInputError, AuthenticationError } = require('apollo-server');
const { pubsub } = require('./subcription');

/** Mongoose models */
const Book = require('../models/book');
const Author = require('../models/author');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const typeDef = gql`
  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(username: String!, favouriteGenre: String!): User
    login(username: String!, password: String!): Token
  }
`;

const resolvers = {
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError('not authenticated');
      }

      const existedAuthor = await Author.findOne({ name: args.author });
      let author;
      try {
        if (existedAuthor) {
          author = existedAuthor;
        } else {
          author = new Author({ name: args.author });
        }
        const book = new Book({
          ...args,
          author,
        });
        await book.save();

        author.books = author.books.concat(book);
        await author.save();

        pubsub.publish('BOOK_ADDED', { bookAdded: book });

        return book;
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
    },
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError('not authenticated');
      }

      let author = await Author.findOne({ name: args.name });
      if (!author) return null;
      try {
        author.born = args.setBornTo;
        await author.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }

      return author;
    },
    createUser: async (root, args) => {
      const user = new User({ ...args });

      return user.save().catch((error) => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== 'secret') {
        throw new UserInputError('wrong credentials');
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };
      const token = jwt.sign(userForToken, config.JWT_SECRET);
      return { value: token };
    },
  },
};

module.exports = { typeDef, resolvers };
