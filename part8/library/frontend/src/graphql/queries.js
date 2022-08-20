import { gql } from '@apollo/client';
import { AUTHOR_DETAILS, BOOK_DETAILS } from './fragments';

export const ALL_AUTHORS = gql`
  query getAllAuthors {
    allAuthors {
      ...AuthorDetails
    }
  }

  ${AUTHOR_DETAILS}
`;

export const ALL_BOOKS = gql`
  query gatAllBooks($genre: String, $author: String) {
    allBooks(genre: $genre, author: $author) {
      ...BookDetails
    }
  }

  ${BOOK_DETAILS}
`;
