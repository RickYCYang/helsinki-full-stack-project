import { gql } from '@apollo/client';

export const AUTHOR_DETAILS = gql`
  fragment AuthorDetails on Author {
    name
    born
    bookCount
    id
  }
`;

export const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    author {
      ...AuthorDetails
    }
    genres
    published
    id
  }

  ${AUTHOR_DETAILS}
`;
