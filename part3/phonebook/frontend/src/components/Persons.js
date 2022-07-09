import Person from './Person';

const Persons = ({ persons, filter, removePersonHandler }) => {
  return (
    <ul style={{ listStyle: 'none', padding: '0px' }}>
      {persons
        .filter((person) => person.name.includes(filter))
        .map((person) => (
          <Person
            person={person}
            key={person.id}
            removePersonHandler={removePersonHandler}
          />
        ))}
    </ul>
  );
};

export default Persons;
