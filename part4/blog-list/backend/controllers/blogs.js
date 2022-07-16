/**
 * Since the express-async-errors has been included in app.js,
 * Each api end point does not need to be warpped by try & catch block.
 * Instead, if an exception occurs in an async route,
 * the execution is automatically passed to the error handling middleware
 */

const Blog = require('../models/blogs');
const blogsRouter = require('express').Router();

/** get all blogs */
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

/** get a specific blog by id */
blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

/** post a new blog */
blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body);
  const savedBlog = await blog.save();
  response.status(201).json(savedBlog);
});

/** exercise 4.13
 * delete a specific blog by id
 */
blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

/** exercise 4.14
 * Update a specific blog by id
 */
blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body;
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes },
    { new: true, runValidators: true, context: 'query' }
  );

  response.json(updatedBlog);
});

module.exports = blogsRouter;
