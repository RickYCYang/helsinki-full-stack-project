import React, { useState } from 'react';
import PropTypes from 'prop-types';

const LoginForm = ({ login }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();

    await login({
      username,
      password,
    });
    setUsername('');
    setPassword('');
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          id="username"
          value={username}
          name="Username"
          autoComplete="username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          id="password"
          value={password}
          name="Password"
          autoComplete="current-password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit" id="login-button">
        login
      </button>
    </form>
  );
};

LoginForm.propTypes = {
  login: PropTypes.func.isRequired,
};

export default LoginForm;
