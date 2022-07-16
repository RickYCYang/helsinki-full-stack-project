const Blog = require('../models/blogs');

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

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
};
