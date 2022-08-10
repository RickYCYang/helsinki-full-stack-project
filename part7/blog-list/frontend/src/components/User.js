import React, { useEffect } from 'react';
import { useMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../redux/reducers/userReducer';
import { isEmpty } from 'lodash';

const User = () => {
  const dispatch = useDispatch();
  const match = useMatch('/users/:id');
  const user = useSelector((state) => {
    return state.user.users.find((user) => user.id === match.params.id);
  });

  useEffect(() => {
    if (isEmpty(user)) {
      dispatch(fetchUsers());
    }
  }, []);

  if (isEmpty(user)) return null;

  return (
    user && (
      <div>
        <h2>{user.username}</h2>
        <h3>added blogs</h3>
        <ul>
          {user.blogs.map((blog) => (
            <li key={blog.id}>{blog.title}</li>
          ))}
        </ul>
      </div>
    )
  );
};

export default User;
