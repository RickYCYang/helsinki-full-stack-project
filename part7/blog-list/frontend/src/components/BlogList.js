import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBlogs, addBlog } from '../redux/reducers/blogsReducer';
import Togglable from './Togglable';
import BlogForm from './BlogForm';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import LabelIcon from '@mui/icons-material/Label';

const BlogList = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);

  const blogFormRef = useRef();

  useEffect(() => {
    dispatch(fetchBlogs());
  }, []);

  const addBlogHandler = async (blog) => {
    blogFormRef.current.toggleVisibility();
    await dispatch(addBlog(blog));
  };

  return (
    <div>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlogHandler} />
      </Togglable>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {blogs
          .slice()
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <ListItem key={blog.id}>
              <Link
                to={`/blogs/${blog.id}`}
                style={{
                  color: 'black',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <LabelIcon sx={{ marginRight: '24px', color: '#1976d2' }} />
                <ListItemText primary={blog.title} />
              </Link>
            </ListItem>
          ))}
      </List>
    </div>
  );
};

export default BlogList;
