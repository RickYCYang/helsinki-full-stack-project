const _ = require('lodash');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const helper = require('./test_helper');
const Blog = require('../models/blogs');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

/** Init users */
beforeAll(async () => {
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash('secret', 10);
  const user1 = new User({ username: 'root', name: 'root', passwordHash });
  const user2 = new User({ username: 'test', name: 'test', passwordHash });
  await user1.save();
  await user2.save();
});

/** Init blogs */
beforeEach(async () => {
  await Blog.deleteMany({});
  const rootUser = await User.findOne({ username: 'root' });
  const blogObjects = helper.initialBlogs.map(
    (blog) => new Blog({ ...blog, user: rootUser._id.toString() })
  );
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs');

    const titles = response.body.map((blog) => blog.title);
    expect(titles).toContain('Hello React');
  });

  test('property id is defined of each blog', async () => {
    const response = await api.get('/api/blogs');
    const blogs = response.body;
    for (const blog of blogs) {
      expect(blog.id).toBeDefined();
    }
  });
});

describe('addition of a new blog', () => {
  /** Get authorization token at first */
  let authorization;
  beforeAll(async () => {
    const user = {
      username: 'root',
      password: 'secret',
    };
    const response = await api.post('/api/login').send(user);
    authorization = `bearer ${response.body.token}`;
  });

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'Rick',
      url: 'https://www.google.com',
      likes: 5,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', authorization)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map((r) => r.title);
    expect(titles).toContain('async/await simplifies making async calls');
  });

  test('blog without title is not added', async () => {
    const newBlog = {
      author: 'Rick',
      url: 'https://www.google.com',
      likes: 5,
    };
    await api
      .post('/api/blogs')
      .set('Authorization', authorization)
      .send(newBlog)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });

  test('a blog missing likes property will default to 0', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'Rick',
      url: 'https://www.google.com',
    };
    await api
      .post('/api/blogs')
      .set('Authorization', authorization)
      .send(newBlog)
      .expect(201);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const savedBlog = _.find(blogsAtEnd, newBlog);
    expect(savedBlog).toHaveProperty('likes', 0);
  });

  test('a blog missing title or url property will get 400 Bad Request error', async () => {
    const newBlog = {
      author: 'Rick',
      likes: 10,
    };
    await api
      .post('/api/blogs')
      .set('Authorization', authorization)
      .send(newBlog)
      .expect(400);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });

  test('a blog can not be added without a proper authorization header', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'Rick',
      url: 'https://www.google.com',
      likes: 5,
    };
    await api.post('/api/blogs').send(newBlog).expect(401);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

describe('viewing a specific blog', () => {
  test('a specific blog can be viewed', async () => {
    const blogsAtStart = await helper.blogsInDb();

    const blogToView = blogsAtStart[0];

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    resultBlog.body.user = resultBlog.body.user.id;
    const processedBlogToView = JSON.parse(JSON.stringify(blogToView));

    expect(resultBlog.body).toEqual(processedBlogToView);
  });
});

describe('deletion of a blog', () => {
  let authorAuthorization;
  let nonAuthorAuthorization;

  beforeAll(async () => {
    const author = {
      username: 'root',
      password: 'secret',
    };
    const nonAuthor = {
      username: 'test',
      password: 'secret',
    };
    let response = await api.post('/api/login').send(author);
    authorAuthorization = `bearer ${response.body.token}`;
    response = await api.post('/api/login').send(nonAuthor);
    nonAuthorAuthorization = `bearer ${response.body.token}`;
  });

  test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', authorAuthorization)
      .expect(204);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);
    const titles = blogsAtEnd.map((r) => r.title);
    expect(titles).not.toContain(blogToDelete.title);
  });

  test('a blog can not be deleted if the requester is not author', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', nonAuthorAuthorization)
      .expect(401);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
