const { gql } = require('apollo-server');
/** Mongoose models */
const Book = require('../models/book');
const Author = require('../models/author');

const typeDef = gql`
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]!
    allAuthors: [Author]!
    me: User
  }
`;

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const books = await Book.find({}).populate('author', {
        name: 1,
        born: 1,
        id: 1,
        books: 1,
      });
      if (!args.author && !args.genre) return books;

      const author = await Author.findOne({ name: args.author });
      const filteredBook = books.filter(
        (book) =>
          (!args.author ||
            book.author._id.toString() === author._id.toString()) &&
          (!args.genre || book.genres.includes(args.genre))
      );
      return filteredBook;
    },
    allAuthors: async () => Author.find({}),
    me: (root, args, { currentUser }) => {
      return currentUser;
    },
  },
};

module.exports = { typeDef, resolvers };
