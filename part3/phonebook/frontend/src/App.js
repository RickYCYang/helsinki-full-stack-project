import { useState, useEffect } from 'react';
/** services */
import personService from './services/persons';
/** components */
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Notification from './components/Notification';

const App = () => {
  /** states */
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [notification, setNotification] = useState({});

  /** initial persons state */
  useEffect(() => {
    personService.getAll().then((initialPersons) => setPersons(initialPersons));
  }, []);

  const submitHandler = (event) => {
    event.preventDefault(); // Prevent page reload
    let existedPerson = getPersonByName(newName);
    if (existedPerson) {
      /** Update a person if it already exists */
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        existedPerson = { ...existedPerson, number: newNumber };
        personService
          .update(existedPerson)
          .then((returnPerson) => {
            console.log('returnPerson', returnPerson);
            const copyPersons = persons.slice();
            copyPersons.forEach((person) => {
              if (person.id === returnPerson.id) {
                /** update target person's phone number */
                person.number = returnPerson.number;
              }
            });
            setPersons(copyPersons);
            showNotification(`Updated ${returnPerson.name}`);
          })
          .catch((error) => {
            showNotification(error.response.data.error, 'error');
          });
      }
    } else {
      /** Create a bew person if it does not exist */
      const newPerson = {
        name: newName,
        number: newNumber,
        id: getNewId(),
      };
      personService
        .create(newPerson)
        .then((returnPerson) => {
          setPersons([...persons, returnPerson]);
          showNotification(`Added ${returnPerson.name}`);
        })
        .catch((error) => {
          showNotification(error.response.data.error, 'error');
        });
    }
    setNewName('');
    setNewNumber('');
  };

  const removePersonHandler = (id) => {
    const person = getPersonById(id);
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          showNotification(`Deleted ${person.name}`);
        })
        .catch((error) => {
          showNotification(
            `Information of ${person.name} has already been removed from server`,
            'error'
          );
          setPersons(persons.filter((person) => person.id !== id));
        });
    }
  };

  const getNewId = () => {
    return (
      persons.reduce((prev, curr) => {
        return Math.max(prev, curr.id);
      }, 0) + 1
    );
  };

  const getPersonById = (id) => {
    return persons.filter((person) => person.id === id)[0];
  };

  const getPersonByName = (name) => {
    return persons.find((person) => person.name === name);
  };

  const showNotification = (message, type = 'normal') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification('');
    }, 3000);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      {notification.message && (
        <Notification message={notification.message} type={notification.type} />
      )}
      <Filter
        filter={filter}
        filterChangeHandler={(event) => setFilter(event.target.value)}
      />
      <h3>Add a new</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        newNameChangeHandler={(event) => setNewName(event.target.value)}
        newNumberChangeHandler={(event) => setNewNumber(event.target.value)}
        submitHandler={submitHandler}
      />
      <h3>Numbers</h3>
      <Persons
        persons={persons}
        filter={filter}
        removePersonHandler={removePersonHandler}
      />
    </div>
  );
};

export default App;
