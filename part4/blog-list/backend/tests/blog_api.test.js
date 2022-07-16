const _ = require('lodash');
const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blogs');

beforeEach(async () => {
  await Blog.deleteMany({});

  // console.log('cleared');

  // Version 1 (w/o bug)
  // let blogObject = new Blog(helper.initialBlogs[0]);
  // await blogObject.save();

  // blogObject = new Blog(helper.initialBlogs[1]);
  // await blogObject.save();

  /** Version 2 (with bug)
   * every iteration of the forEach loop generates its own asynchronous operation,
   * and beforeEach won't wait for them to finish executing.
   * In other words, the await commands defined inside of the forEach loop are
   * not in the beforeEach function,
   * but in separate functions that beforeEach will not wait for.
   */
  // helper.initialBlogs.forEach(async (blog) => {
  //   let blogObject = new Blog(blog);
  //   await blogObject.save();
  //   console.log('saved');
  // });

  /** Version 2.1 (w/o bug): Fix version 2 */
  // for (let blog of helper.initialBlogs) {
  //   let blogObject = new Blog(blog);
  //   await blogObject.save();
  // }

  /**  Version 3 (w/o bug) */
  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);

  //console.log('done');
});

test('blogs are returned as json', async () => {
  //console.log('func start');
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

/** execrise 4.8 */
test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

/** execrise 4.9 */
test('property id is defined of each blog', async () => {
  const response = await api.get('/api/blogs');
  const blogs = response.body;
  for (const blog of blogs) {
    expect(blog.id).toBeDefined();
  }
});

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs');

  const titles = response.body.map((blog) => blog.title);
  expect(titles).toContain('Hello React');
});

/** execrise 4.10 */
test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'async/await simplifies making async calls',
    author: 'Rick',
    url: 'https://www.google.com',
    likes: 5,
  };

  await api
    .post('/api/blogs')
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
  await api.post('/api/blogs').send(newBlog).expect(400);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
});

/** exercise 4.11 */
test('a blog missing likes property will default to 0', async () => {
  const newBlog = {
    title: 'async/await simplifies making async calls',
    author: 'Rick',
    url: 'https://www.google.com',
  };
  await api.post('/api/blogs').send(newBlog).expect(201);
  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const savedBlog = _.find(blogsAtEnd, newBlog);
  expect(savedBlog).toHaveProperty('likes', 0);
});

/** exercise 4.12 */
test('a blog missing title or url property will get 400 Bad Request error', async () => {
  const newBlog = {
    author: 'Rick',
    likes: 10,
  };
  await api.post('/api/blogs').send(newBlog).expect(400);
  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
});

test('a specific blog can be viewed', async () => {
  const blogsAtStart = await helper.blogsInDb();

  const blogToView = blogsAtStart[0];

  const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const processedBlogToView = JSON.parse(JSON.stringify(blogToView));

  expect(resultBlog.body).toEqual(processedBlogToView);
});

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToDelete = blogsAtStart[0];

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const blogsAtEnd = await helper.blogsInDb();

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

  const titles = blogsAtEnd.map((r) => r.title);

  expect(titles).not.toContain(blogToDelete.title);
});

afterAll(() => {
  mongoose.connection.close();
});
