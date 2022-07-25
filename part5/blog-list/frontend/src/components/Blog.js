import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog, updateBlog, removeBlog, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };
  const [showDetail, setShowDetail] = useState(false);
  const isPoster = blog.user.id === user.id;

  return (
    <li style={blogStyle} className="blog">
      <span>
        {blog.title} {blog.author}
      </span>
      <button onClick={() => setShowDetail(!showDetail)}>
        {showDetail ? 'hide' : 'view'}
      </button>
      {showDetail && (
        <div>
          <p>{blog.url}</p>
          <p>
            likes {blog.likes}{' '}
            <button onClick={() => updateBlog(blog)}>like</button>
          </p>
          <p>{blog.user.username}</p>
          {isPoster && (
            <p>
              <button onClick={() => removeBlog(blog)}>remove</button>
            </p>
          )}
        </div>
      )}
    </li>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default Blog;
