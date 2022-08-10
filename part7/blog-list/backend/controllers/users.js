/**
 * Since the express-async-errors has been included in app.js,
 * Each api end point does not need to be warpped by try & catch block.
 * Instead, if an exception occurs in an async route,
 * the execution is automatically passed to the error handling middleware
 */

const bcrypt = require('bcryptjs');
const User = require('../models/user');
const usersRouter = require('express').Router();

/** create new user */
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;
  if (!username) {
    return response.status(400).json({ error: 'Invalid username' });
  }
  if (!password || password.length < 3) {
    return response.status(400).json({
      error: 'Invalid password',
    });
  }
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique',
    });
  }
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();
  response.status(201).json(savedUser);
});

/** get all users */
usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
  });
  response.json(users);
});

/** delete a specific user by id */
usersRouter.delete('/:id', async (request, response) => {
  await User.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

module.exports = usersRouter;
