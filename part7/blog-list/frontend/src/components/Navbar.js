import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/reducers/userReducer';
import Button from '@mui/material/Button';

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  return (
    <nav
      style={{
        background: '#1976d2',
        padding: '4px',
        margin: '0px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
      }}
    >
      <ul
        style={{
          listStyle: 'none',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '0px',
          margin: '0px',
          fontSize: '24px',
        }}
      >
        <li
          style={{ marginRight: '16px', display: 'flex', alignItems: 'center' }}
        >
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            blogs
          </Link>
        </li>
        <li style={{ marginRight: '24px' }}>
          <Link to="/users" style={{ color: 'white', textDecoration: 'none' }}>
            users
          </Link>
        </li>
      </ul>
      <div>
        <span style={{ marginRight: '24px' }}>{user.username} logged in</span>
        <Button
          variant="contained"
          color="success"
          onClick={() => dispatch(logout())}
        >
          logout
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
