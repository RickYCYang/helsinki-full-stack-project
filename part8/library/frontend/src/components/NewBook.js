import { useState } from 'react';
import { updateCache } from '../App';
import { useMutation } from '@apollo/client';
import { ALL_BOOKS, ALL_AUTHORS } from '../graphql/queries';
import { ADD_BOOK } from '../graphql/mutations';

const NewBook = ({ show, setError }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [published, setPublished] = useState('');
  const [genre, setGenre] = useState('');
  const [genres, setGenres] = useState([]);

  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
    onError: (error) => {
      setError(error.graphQLErrors[0].message);
    },
    /** beside of refetch data from backend, we could update the cache of frontend by ourself */
    update: (cache, response) => {
      // cache.updateQuery({ query: ALL_PERSONS }, ({ allPersons }) => {
      //   return {
      //     allPersons: allPersons.concat(response.data.addPerson),
      //   };
      // });
      updateCache(cache, { query: ALL_BOOKS }, response.data.addBook);
    },
  });

  if (!show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();

    console.log('add book...');
    addBook({
      variables: {
        title,
        author,
        published: parseFloat(published),
        genres,
      },
    });

    setTitle('');
    setPublished('');
    setAuthor('');
    setGenres([]);
    setGenre('');
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre('');
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;
