const Blog = require('../models/blogs');
const User = require('../models/user');

const initialBlogs = [
  {
    title: 'Hello Express',
    author: 'Rick',
    url: 'https://www.google.com',
    likes: 5,
  },
  {
    title: 'Hello React',
    author: 'Aris',
    url: 'https://www.google.com',
    likes: 10,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'async/await simplifies making async calls',
    author: 'Rick',
    url: 'https://www.google.com',
    likes: 5,
  });
  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
};
