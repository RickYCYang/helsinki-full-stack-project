import React from 'react';
import { Link } from 'react-router-dom';

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map((anecdote) => (
        <li key={anecdote.id}>
          <Link to={`anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
          <button>vote</button>
        </li>
      ))}
    </ul>
  </div>
);

export default AnecdoteList;
