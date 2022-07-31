import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { vote } from '../reducers/anecdoteReducer';
import { showNotification } from '../reducers/notificationReducer';
import Anecdote from './Anecdote';

const AnecdoteList = () => {
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.filter);
  const anecdotes = useSelector((state) =>
    state.anecdotes.filter((anecdote) => anecdote.content.indexOf(filter) >= 0)
  );

  const voteHandler = (anecdote) => {
    dispatch(vote(anecdote));
    dispatch(showNotification(`you voted '${anecdote.content}'`, 5));
  };

  return (
    <>
      {anecdotes
        .slice()
        .sort((a, b) => b.votes - a.votes)
        .map((anecdote) => (
          <Anecdote
            key={anecdote.id}
            content={anecdote.content}
            votes={anecdote.votes}
            voteHandler={() => voteHandler(anecdote)}
          />
        ))}
    </>
  );
};

export default AnecdoteList;
