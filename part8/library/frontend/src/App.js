import { useState, useEffect } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import Notify from './components/Notify';
import { ALL_AUTHORS, ALL_BOOKS } from './graphql/queries';
import { ME } from './graphql/mutations';
import { BOOK_ADDED } from './graphql/subscriptions';
import { useQuery, useApolloClient, useSubscription } from '@apollo/client';
import LoginForm from './components/LoginForm';
import Recommendations from './components/Recommendations';

// function that takes care of manipulating cache
export const updateCache = (cache, query, addedBook) => {
  const uniqByName = (a) => {
    let seen = new Set();
    return a.filter((item) => {
      let k = item.name;
      return seen.has(k) ? false : seen.add(k);
    });
  };
  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook)),
    };
  });
};

const App = () => {
  const [page, setPage] = useState('authors');
  const [token, setToken] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const authorResult = useQuery(ALL_AUTHORS, {});
  const bookResult = useQuery(ALL_BOOKS, {});
  const meResult = useQuery(ME, {
    skip: !token,
  });
  const client = useApolloClient();

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData, client }) => {
      const addedBook = subscriptionData.data.bookAdded;
      console.log('subscriptionData', addedBook);
      notify(`${addedBook.title} - ${addedBook.author.name} added`);
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook);
    },
  });

  useEffect(() => {
    const token = localStorage.getItem('library-user-token');
    if (token) setToken(token);
  }, []);

  /** refetch data after changing page */
  useEffect(() => {
    if (page === 'recommend' && meResult.data) {
      bookResult.refetch({ genre: meResult.data.me.favouriteGenre });
    }
    if (page === 'books') {
      console.log(123);
      bookResult.refetch({ genre: null });
    }
  }, [page]); // eslint-disable-line

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 20000);
  };

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
    setPage('login');
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {token && (
          <button onClick={() => setPage('recommend')}>recommend</button>
        )}
        {!token ? (
          <button onClick={() => setPage('login')}>login</button>
        ) : (
          <button onClick={logout}>logout</button>
        )}
      </div>
      <Notify errorMessage={errorMessage} />
      <Authors
        show={page === 'authors'}
        authors={authorResult.data ? authorResult.data.allAuthors : []}
        setError={notify}
        token={token}
      />
      <Books
        show={page === 'books'}
        books={bookResult.data ? bookResult.data.allBooks : []}
        refetch={bookResult.refetch}
        setError={notify}
      />
      <Recommendations
        show={page === 'recommend'}
        books={bookResult.data ? bookResult.data.allBooks : []}
        favouriteGenre={meResult.data ? meResult.data.me.favouriteGenre : ''}
      />
      <NewBook show={page === 'add'} setError={notify} />
      <LoginForm
        show={page === 'login'}
        setError={notify}
        setPage={setPage}
        setToken={setToken}
      />
    </div>
  );
};

export default App;
