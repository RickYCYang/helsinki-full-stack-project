import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { chkLogined } from './redux/reducers/userReducer';
import Notification from './components/Notification';
import UserList from './components/UserList';
import Login from './components/Login';
import BlogList from './components/BlogList';
import Blog from './components/Blog';
import User from './components/User';
import Navbar from './components/Navbar';
import { isEmpty } from 'lodash';

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const notification = useSelector((state) => state.notification);

  useEffect(() => {
    dispatch(chkLogined());
  }, []);

  if (isEmpty(user)) {
    return <Login />;
  }

  return (
    <div>
      <Navbar />
      <h1>blog app</h1>
      <Notification message={notification.message} error={notification.error} />
      <Routes>
        <Route path="/" element={<BlogList />} />
        <Route path="/blogs/:id" element={<Blog />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/:id" element={<User />} />
      </Routes>
    </div>
  );
};

export default App;
