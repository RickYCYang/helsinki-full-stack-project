import React from 'react';
import { useSelector } from 'react-redux';
import Notification from './Notification';
import LoginForm from './LoginForm';

const Login = () => {
  const notification = useSelector((state) => state.notification);

  return (
    <div>
      <h2>log in to application</h2>
      <Notification message={notification.message} error={notification.error} />
      <LoginForm />
    </div>
  );
};

export default Login;
