import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const addBlog = async (event) => {
    event.preventDefault();
    await createBlog({
      title,
      author,
      url,
    });
    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div style={{ marginBottom: '12px' }}>
          <div>
            title:
            <input
              type="text"
              id="title"
              value={title}
              name="Title"
              placeholder="write here blog title"
              onChange={({ target }) => setTitle(target.value)}
            />
          </div>
          <div>
            author:
            <input
              type="text"
              id="author"
              value={author}
              name="Author"
              placeholder="write here blog author"
              onChange={({ target }) => setAuthor(target.value)}
            />
          </div>
          <div>
            url:
            <input
              type="text"
              id="url"
              value={url}
              name="Url"
              placeholder="write here blog url"
              onChange={({ target }) => setUrl(target.value)}
            />
          </div>
        </div>
        <Button type="submit" variant="contained" sx={{ marginBottom: '16px' }}>
          create
        </Button>
      </form>
    </div>
  );
};

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default BlogForm;
