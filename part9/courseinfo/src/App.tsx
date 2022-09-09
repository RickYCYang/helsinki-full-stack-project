// new types
interface CoursePartBase {
  name: string;
  exerciseCount: number;
  type: string;
}

interface CoursePartDesc extends CoursePartBase {
  description: string;
}

interface CourseNormalPart extends CoursePartDesc {
  type: 'normal';
}

interface CourseProjectPart extends CoursePartBase {
  type: 'groupProject';
  groupProjectCount: number;
}

interface CourseSubmissionPart extends CoursePartDesc {
  type: 'submission';
  exerciseSubmissionLink: string;
}

interface CourseSpecialPart extends CoursePartDesc {
  type: 'special';
  requirements: string[];
}

type CoursePart =
  | CourseNormalPart
  | CourseProjectPart
  | CourseSubmissionPart
  | CourseSpecialPart;

interface HeaderProps {
  name: string;
}

const Header = ({ name }: HeaderProps): JSX.Element => {
  return <h1>{name}</h1>;
};

interface ContentProps {
  courseParts: CoursePart[];
}

const Content = ({ courseParts }: ContentProps): JSX.Element => (
  <ul style={{ padding: '0px' }}>
    {courseParts.map((coursePart) => (
      <Part coursePart={coursePart} key={coursePart.name} />
    ))}
  </ul>
);

interface PartProps {
  coursePart: CoursePart;
}

const Part = ({ coursePart }: PartProps): JSX.Element => {
  const getPartExtraContent = (): JSX.Element => {
    switch (coursePart.type) {
      case 'normal': {
        return (
          <p style={{ margin: '0px', fontStyle: 'italic' }}>
            {coursePart.description}
          </p>
        );
      }
      case 'groupProject': {
        return (
          <p style={{ margin: '0px' }}>
            project exercises {coursePart.groupProjectCount}
          </p>
        );
      }
      case 'submission': {
        return (
          <>
            <p style={{ margin: '0px', fontStyle: 'italic' }}>
              {coursePart.description}
            </p>
            <p style={{ margin: '0px' }}>{coursePart.exerciseSubmissionLink}</p>
          </>
        );
      }
      case 'special': {
        return (
          <>
            <p style={{ margin: '0px', fontStyle: 'italic' }}>
              {coursePart.description}
            </p>
            <p style={{ margin: '0px' }}>
              required skills: {coursePart.requirements.join(', ')}
            </p>
          </>
        );
      }
      default:
        return assertNever(coursePart);
    }
  };

  /**
   * Helper function for exhaustive type checking
   */
  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  return (
    <li style={{ marginBottom: '16px' }}>
      <p style={{ fontWeight: 'bold', margin: '0px' }}>
        {coursePart.name} {coursePart.exerciseCount}
      </p>
      {getPartExtraContent()}
    </li>
  );
};

interface TotalProps {
  courseParts: CoursePart[];
}

const Total = ({ courseParts }: TotalProps): JSX.Element => (
  <p>
    Number of exercises{' '}
    {courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
  </p>
);

const App = () => {
  const courseName = 'Half Stack application development';
  const courseParts: CoursePart[] = [
    {
      name: 'Fundamentals',
      exerciseCount: 10,
      description: 'This is the easy course part',
      type: 'normal',
    },
    {
      name: 'Advanced',
      exerciseCount: 7,
      description: 'This is the hard course part',
      type: 'normal',
    },
    {
      name: 'Using props to pass data',
      exerciseCount: 7,
      groupProjectCount: 3,
      type: 'groupProject',
    },
    {
      name: 'Deeper type usage',
      exerciseCount: 14,
      description: 'Confusing description',
      exerciseSubmissionLink: 'https://fake-exercise-submit.made-up-url.dev',
      type: 'submission',
    },
    {
      name: 'Backend development',
      exerciseCount: 21,
      description: 'Typing the backend',
      requirements: ['nodejs', 'jest'],
      type: 'special',
    },
  ];

  return (
    <div>
      <Header name={courseName} />
      <Content courseParts={courseParts} />
      <Total courseParts={courseParts} />
    </div>
  );
};

export default App;
