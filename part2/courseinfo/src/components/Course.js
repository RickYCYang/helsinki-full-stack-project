const Header = ({ name }) => <h2>{name}</h2>;

const Content = ({ parts }) => (
  <ul style={{ listStyle: 'none', padding: '0px' }}>
    {parts.map((part) => (
      <Part part={part} key={part.id} />
    ))}
  </ul>
);

const Part = ({ part }) => (
  <li style={{ marginTop: '8px', marginBottom: '8px' }}>
    {part.name} {part.exercises}
  </li>
);

const Total = ({ sum }) => (
  <p style={{ fontWeight: 'bold' }}>total of {sum} exercises</p>
);

const Course = ({ course }) => {
  const sum = course.parts.reduce((prev, curr) => prev + curr.exercises, 0);
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total sum={sum} />
    </div>
  );
};

export default Course;
