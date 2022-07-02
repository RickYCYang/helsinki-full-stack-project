const PersonForm = ({
  newName,
  newNumber,
  newNameChangeHandler,
  newNumberChangeHandler,
  submitHandler,
}) => {
  return (
    <form onSubmit={submitHandler}>
      <div>
        name:
        <input value={newName} onChange={newNameChangeHandler} />
      </div>
      <div>
        number:
        <input value={newNumber} onChange={newNumberChangeHandler} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
