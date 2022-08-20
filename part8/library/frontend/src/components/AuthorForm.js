import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { ALL_AUTHORS } from '../graphql/queries';
import { EDIT_AUTHOR } from '../graphql/mutations';
import { useMutation } from '@apollo/client';

const AuthorForm = ({ authors }) => {
  const [born, setBorn] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState({});
  const [authorOptions, setAuthorOptions] = useState(authors);
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  useEffect(() => {
    if (authors && authors.length > 0) {
      const options = authors.map((author) => ({
        ...author,
        label: author.name,
        value: author.name,
      }));
      setAuthorOptions(options);
      setSelectedAuthor(options[0]);
    }
  }, [authors]); // eslint-disable-line

  useEffect(() => {
    setBorn(selectedAuthor.born || '');
  }, [selectedAuthor]);

  const submitHandler = (event) => {
    event.preventDefault();
    editAuthor({
      variables: { name: selectedAuthor.name, setBornTo: parseFloat(born) },
    });
  };

  return (
    <form onSubmit={submitHandler}>
      <h3>authors</h3>
      <Select
        options={authorOptions}
        value={selectedAuthor}
        onChange={(option) => setSelectedAuthor(option)}
      />
      <div>
        born
        <input
          type="number"
          value={born}
          onChange={(event) => setBorn(event.target.value)}
        />
      </div>
      <button type="submit">update author</button>
    </form>
  );
};

export default AuthorForm;
