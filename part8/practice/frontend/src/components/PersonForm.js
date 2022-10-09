import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ALL_PERSONS, CREATE_PERSON } from '../queries';
import { updateCache } from '../App';

const PersonForm = ({ setError }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');

  const [createPerson] = useMutation(CREATE_PERSON, {
    // refetchQueries: [{ query: ALL_PERSONS }], // refetch data by sending request to backend after mutation
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
      updateCache(cache, { query: ALL_PERSONS }, response.data.addPerson);
    },
  });

  const submit = (event) => {
    event.preventDefault();

    createPerson({
      variables: {
        name,
        phone: phone.length > 0 ? phone : undefined,
        street,
        city,
      },
    });

    setName('');
    setPhone('');
    setStreet('');
    setCity('');
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={submit}>
        <div>
          name{' '}
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          phone{' '}
          <input
            value={phone}
            onChange={({ target }) => setPhone(target.value)}
          />
        </div>
        <div>
          street{' '}
          <input
            value={street}
            onChange={({ target }) => setStreet(target.value)}
          />
        </div>
        <div>
          city{' '}
          <input
            value={city}
            onChange={({ target }) => setCity(target.value)}
          />
        </div>
        <button type="submit">add!</button>
      </form>
    </div>
  );
};

export default PersonForm;