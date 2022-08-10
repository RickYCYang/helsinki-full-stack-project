import React, { useState } from 'react';
import { login } from '../redux/reducers/userReducer';
import { useDispatch } from 'react-redux';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const LoginForm = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();

    await dispatch(
      login({
        username,
        password,
      })
    );
    setUsername('');
    setPassword('');
  };

  return (
    <form onSubmit={handleLogin}>
      <div
        style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}
      >
        <label style={{ marginRight: '16px' }}>Username</label>
        <TextField
          type="text"
          id="username"
          value={username}
          name="Username"
          autoComplete="username"
          onChange={({ target }) => setUsername(target.value)}
          label="username"
          variant="outlined"
          size="small"
        />
      </div>
      <div
        style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}
      >
        <label style={{ marginRight: '16px' }}>Password</label>
        <TextField
          type="password"
          id="password"
          value={password}
          name="Password"
          autoComplete="current-password"
          onChange={({ target }) => setPassword(target.value)}
          label="password"
          variant="outlined"
          size="small"
        />
      </div>
      <Button type="submit" variant="contained" sx={{ marginBottom: '16px' }}>
        login
      </Button>
    </form>
  );
};

export default LoginForm;
