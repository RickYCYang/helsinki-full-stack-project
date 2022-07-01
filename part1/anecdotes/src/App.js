import { useState } from 'react';

const Button = ({ text, onClick }) => {
  return (
    <button
      style={{
        backgroundColor: 'white',
        borderColor: 'lightgray',
        borderRadius: '8px',
        cursor: 'pointer',
        padding: '8px',
        marginRight: '4px',
      }}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

const App = () => {
  /** variable */
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
  ];

  /** state */
  const [selected, setSelected] = useState(0);
  const [points, setPoints] = useState(new Array(anecdotes.length).fill(0));

  /** func */
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  const voteHandler = () => {
    const copy = points.slice();
    copy[selected] += 1;
    setPoints(copy);
  };

  const getMostVoteAnecdote = () => {
    const maxVote = Math.max.apply(null, points);
    /** find the first index of maxVote in points */
    const indexOfMaxVote = points.indexOf(maxVote);
    return anecdotes[indexOfMaxVote];
  };

  return (
    <div>
      <h2>Anecdote of the day</h2>
      <p>{anecdotes[selected]}</p>
      <p>has {points[selected]} votes</p>
      <Button text="vote" onClick={voteHandler} />
      <Button
        text="next anecdotes"
        onClick={() => setSelected(getRandomInt(anecdotes.length))}
      />
      <h2>Anecdote with most votes</h2>
      <p>{getMostVoteAnecdote()}</p>
    </div>
  );
};

export default App;
