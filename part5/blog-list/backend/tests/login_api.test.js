const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const User = require('../models/user');

beforeAll(async () => {
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash('secret', 10);
  const user = new User({ username: 'root', name: 'root', passwordHash });
  await user.save();
});

describe('when there is initially some users saved', () => {
  test('login successfully if username and password are correct', async () => {
    const user = {
      username: 'root',
      password: 'secret',
    };
    const response = await api
      .post('/api/login')
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const decodedToken = jwt.verify(response.body.token, process.env.SECRET);
    expect(response.body.username).toBe(user.username);

    const rootUser = await User.findOne({ username: 'root' });
    expect(decodedToken.username).toBe(user.username);
    expect(decodedToken.id).toBe(rootUser._id.toString());
  });

  test('login fail if username and password are invalid', async () => {
    const user = {
      username: 'root',
      password: 'test',
    };
    const response = await api
      .post('/api/login')
      .send(user)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toBe('invalid username or password');
  });
});

afterAll(() => {
  mongoose.connection.close();
});
