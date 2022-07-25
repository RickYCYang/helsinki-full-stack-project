import React, { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import BlogForm from './components/BlogForm';
import LoginForm from './components/LoginForm';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [notification, setNotification] = useState({});
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);

  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const login = async (userObject) => {
    try {
      const user = await loginService.login(userObject);
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
    } catch (exception) {
      setNotification({ message: 'Wrong username or password', error: true });
      setTimeout(() => {
        setNotification({});
      }, 5000);
    }
  };

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
  };

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility();
      const newBlog = await blogService.create(blogObject);
      setBlogs([...blogs, newBlog]);
      setNotification({
        message: `a new blog ${newBlog.title} by ${newBlog.author} added`,
      });
    } catch (exception) {
      setNotification({ message: 'Something wrong', error: true });
    } finally {
      setTimeout(() => {
        setNotification({});
      }, 5000);
    }
  };

  const updateBlog = async (blog) => {
    try {
      const updatedBlog = await blogService.update(blog.id, {
        author: blog.author,
        likes: blog.likes + 1,
        title: blog.title,
        url: blog.url,
        user: blog.user.id,
      });
      const updatedBlogs = blogs.map((blog) => {
        if (blog.id === updatedBlog.id) return updatedBlog;
        return blog;
      });
      setBlogs(updatedBlogs);
      setNotification({
        message: `increased likes of blog ${updatedBlog.title} by ${updatedBlog.author}`,
      });
    } catch (error) {
      setNotification({ message: 'Something wrong', error: true });
    } finally {
      setTimeout(() => {
        setNotification({});
      }, 5000);
    }
  };

  const removeBlog = async (blog) => {
    const confirm = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}`
    );
    if (!confirm) return;

    try {
      await blogService.remove(blog.id);
      const updatedBlogs = blogs.filter((oldBlog) => oldBlog.id !== blog.id);
      setBlogs(updatedBlogs);
      setNotification({
        message: `remove blog ${blog.title} by ${blog.author}`,
      });
    } catch (err) {
      setNotification({ message: 'Something wrong', error: true });
    } finally {
      setTimeout(() => {
        setNotification({});
      }, 5000);
    }
  };

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification
          message={notification.message}
          error={notification.error}
        />
        <LoginForm login={login} logout={logout} />
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification.message} error={notification.error} />
      <p>
        {user.username} logged in <button onClick={logout}>logout</button>
      </p>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      <ul style={{ listStyleType: 'none', paddingLeft: '0px' }}>
        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              updateBlog={updateBlog}
              removeBlog={removeBlog}
              user={user}
            />
          ))}
      </ul>
    </div>
  );
};

export default App;
