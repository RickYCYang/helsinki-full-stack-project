import React from 'react';
import { connect } from 'react-redux';
import { createAnecdote } from '../reducers/anecdoteReducer';
import { showNotification } from '../reducers/notificationReducer';

const AnecdoteForm = (props) => {
  const submitHandler = async (event) => {
    event.preventDefault();
    const { value } = event.target.anecdote;
    props.createAnecdote(value);
    props.showNotification(`added a new anecdote '${value}'`, 5);
    event.target.anecdote.value = '';
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={submitHandler}>
        <div>
          <input name="anecdote" />
        </div>
        <button>create</button>
      </form>
    </div>
  );
};

const mapDispatchToProps = {
  createAnecdote,
  showNotification,
};

export default connect(null, mapDispatchToProps)(AnecdoteForm);
