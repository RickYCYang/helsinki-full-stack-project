/** dotenv-expand is to compose env variable
 * ref: https://www.npmjs.com/package/dotenv-expand
 */
var dotenv = require('dotenv');
var dotenvExpand = require('dotenv-expand');
dotenvExpand.expand(dotenv.config());

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

/** Serve static files */
app.use(express.static('build'));

/** Parse request body from json to JS object */
app.use(express.json());

/** morgan is HTTP request logger middleware for node.js
 * ref: https://github.com/expressjs/morgan
 */
const requestLogger = morgan((tokens, req, res) => {
  const hasBody = Object.keys(req.body).length;
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'),
    '-',
    tokens['response-time'](req, res),
    'ms',
    hasBody ? JSON.stringify(req.body) : null,
  ].join(' ');
});
app.use(requestLogger);

/** cors is to process cross origin policy */
app.use(cors());

/** get all persons */
app.get('/api/persons', async (request, response, next) => {
  try {
    console.log('/api/persons');
    const persons = await Person.find({});
    response.json(persons);
  } catch (error) {
    next(error);
  }
});

/** get person by id */
app.get('/api/persons/:id', async (request, response, next) => {
  try {
    const person = await Person.findById(request.params.id);
    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

/** create a new person */
app.post('/api/persons', async (request, response, next) => {
  try {
    const { name, number } = request.body;
    let person = new Person({
      name,
      number,
    });
    await person.save();
    response.json(person);
  } catch (error) {
    next(error);
  }
});

/** Update person by id */
app.put('/api/persons/:id', async (request, response, next) => {
  try {
    const { number } = request.body;
    const updatedPerson = await Person.findByIdAndUpdate(
      request.params.id,
      {
        number,
      },
      { new: true, runValidators: true, context: 'query' }
    );
    response.json(updatedPerson);
  } catch (error) {
    next(error);
  }
});

/** delete person by id */
app.delete('/api/persons/:id', async (request, response, next) => {
  try {
    await Person.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

/** get info */
app.get('/info', async (request, response, next) => {
  try {
    const persons = await Person.find({});
    response.send(`
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>
    `);
  } catch (error) {
    next(error);
  }
});

const unknownEndpoint = (request, response) => {
  console.log('unknownEndpoint');
  response.status(404).send({ error: 'unknown endpoint' });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

// handler of requests with result to errors
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
