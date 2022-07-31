import { createSlice } from '@reduxjs/toolkit';
import anecdotesService from '../services/anecdotes';

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote: (state, action) => {
      state.push(action.payload);
    },
    setAnecdotes: (state, action) => {
      return action.payload;
    },
    setAnecdote: (state, action) => {
      return state.map((anecdote) =>
        anecdote.id === action.payload.id ? action.payload : anecdote
      );
    },
  },
});

export const { appendAnecdote, setAnecdotes, setAnecdote } =
  anecdoteSlice.actions;
export default anecdoteSlice.reducer;

export const initialAnecdotes = () => async (dispatch) => {
  const data = await anecdotesService.getAll();
  dispatch(setAnecdotes(data));
};

export const createAnecdote = (content) => async (dispatch) => {
  const insertedAnecdote = await anecdotesService.createNew(content);
  dispatch(appendAnecdote(insertedAnecdote));
};

export const vote = (anecdote) => async (dispatch) => {
  const votes = anecdote.votes + 1;
  const updatedAnecdote = await anecdotesService.update(anecdote.id, votes);
  dispatch(setAnecdote(updatedAnecdote));
};
