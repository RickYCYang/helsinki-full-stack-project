import axios from 'axios';

const baseUrl = 'http://localhost:3001/anecdotes';

const getId = () => (100000 * Math.random()).toFixed(0);

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0,
  };
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const createNew = async (anecdote) => {
  const object = asObject(anecdote);
  const response = await axios.post(baseUrl, object);
  return response.data;
};

const update = async (id, votes) => {
  const response = await axios.patch(`${baseUrl}/${id}`, { votes });
  return response.data;
};

const anecdotesService = { getAll, createNew, update };
export default anecdotesService;
