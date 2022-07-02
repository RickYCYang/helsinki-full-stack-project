const Filter = ({ filter, filterChangeHandler }) => {
  return (
    <div>
      filter shown with
      <input value={filter} onChange={filterChangeHandler} />
    </div>
  );
};

export default Filter;
