import React from 'react';

const Anecdote = ({ content, votes, voteHandler }) => {
  return (
    <div>
      <div>{content}</div>
      <div>
        has {votes}
        <button onClick={voteHandler}>vote</button>
      </div>
    </div>
  );
};

export default Anecdote;
