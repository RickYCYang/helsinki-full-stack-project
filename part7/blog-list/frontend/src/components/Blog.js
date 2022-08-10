import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMatch } from 'react-router-dom';
import { fetchBlogs, updateBlog } from '../redux/reducers/blogsReducer';
import BlogComments from './BlogComment';
import { isEmpty } from 'lodash';
import Button from '@mui/material/Button';

const Blog = () => {
  const dispatch = useDispatch();
  const match = useMatch('/blogs/:id');
  const blog = useSelector((state) =>
    state.blogs.find((blog) => blog.id === match.params.id)
  );

  useEffect(() => {
    if (isEmpty(blog)) {
      dispatch(fetchBlogs());
    }
  }, []);

  if (isEmpty(blog)) return null;

  return (
    <div>
      <h2>{blog.title}</h2>
      <a href={blog.url}>{blog.url}</a>
      <p>
        {blog.likes} likes{' '}
        <Button variant="contained" onClick={() => dispatch(updateBlog(blog))}>
          like
        </Button>
      </p>
      <p>added by {blog.user.username}</p>
      <BlogComments blog={blog} />
    </div>
  );
};

export default Blog;
