const Person = ({ person, removePersonHandler }) => {
  return (
    <li>
      {person.name} {person.number}{' '}
      <button onClick={() => removePersonHandler(person.id)}>delete</button>
    </li>
  );
};

export default Person;
