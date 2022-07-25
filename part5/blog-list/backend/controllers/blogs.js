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
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

/** get a specific blog by id */
blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', {
    username: 1,
    name: 1,
  });
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

/** post a new blog */
blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body;
  const user = request.user;
  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user._id,
  });
  let savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  savedBlog = await savedBlog.populate('user', {
    username: 1,
    name: 1,
  });
  response.status(201).json(savedBlog);
});

/** delete a specific blog by id */
blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user;
  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    const authorId = blog.user.toString() || '';
    if (authorId !== user._id.toString()) {
      return response
        .status(401)
        .json({ error: 'invalid operation: no permission' });
    }
  }
  await Blog.findByIdAndDelete(request.params.id);
  user.blogs = user.blogs.filter(
    (blog) => blog._id.toString() !== request.params.id
  );
  await user.save();
  response.status(204).end();
});

/** Update a specific blog by id */
blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body;
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes },
    { new: true, runValidators: true, context: 'query' }
  ).populate('user', {
    username: 1,
    name: 1,
  });

  response.json(updatedBlog);
});

module.exports = blogsRouter;
