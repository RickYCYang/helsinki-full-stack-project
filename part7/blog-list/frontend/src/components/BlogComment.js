import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { addComment } from '../redux/reducers/blogsReducer';
import { useDispatch } from 'react-redux';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CommentIcon from '@mui/icons-material/Comment';
import IconButton from '@mui/material/IconButton';

const BlogComments = ({ blog }) => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState('');

  const addCommentHandler = async () => {
    await dispatch(addComment(blog.id, comment));
    setComment('');
  };

  return (
    <div>
      <h3>comments</h3>
      <div>
        <TextField
          label="comment"
          variant="outlined"
          onChange={(event) => setComment(event.target.value)}
          value={comment}
          size="small"
        />
        <Button variant="contained" onClick={addCommentHandler}>
          add comment
        </Button>
      </div>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {blog.comments.map((comment, index) => (
          <ListItem key={index}>
            <CommentIcon sx={{ marginRight: '24px' }} />
            <ListItemText primary={comment} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default BlogComments;

BlogComments.propTypes = {
  blog: PropTypes.object,
};
