import { createSlice } from '@reduxjs/toolkit';
import blogsService from '../../services/blogs';
import { showNotification } from './notificationReducer';

const initialState = [];

const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    setBlogs: (state, action) => {
      return action.payload.slice();
    },
    pushBlog: (state, action) => {
      state.push(action.payload);
    },
    setBlog: (state, action) => {
      return state.map((blog) =>
        blog.id === action.payload.id ? action.payload : blog
      );
    },
    filterBlog: (state, action) => {
      return state.filter((blog) => blog.id !== action.payload.id);
    },
  },
});

export const { setBlogs, pushBlog, setBlog, filterBlog } = blogsSlice.actions;
export default blogsSlice.reducer;

export const fetchBlogs = () => async (dispatch) => {
  const blogs = await blogsService.getAll();
  dispatch(setBlogs(blogs));
};

export const addBlog = (blog) => async (dispatch) => {
  try {
    const newBlog = await blogsService.create(blog);
    dispatch(pushBlog(newBlog));
    dispatch(
      showNotification(`a new blog ${newBlog.title} by ${newBlog.author} added`)
    );
  } catch (error) {
    dispatch(showNotification('Something wrong', true));
  }
};

export const updateBlog = (blog) => async (dispatch) => {
  try {
    const updatedBlog = await blogsService.update(blog.id, {
      author: blog.author,
      likes: blog.likes + 1,
      title: blog.title,
      url: blog.url,
      user: blog.user.id,
    });
    dispatch(setBlog(updatedBlog));
    dispatch(
      showNotification(
        `increased likes of blog ${updatedBlog.title} by ${updatedBlog.author}`
      )
    );
  } catch (error) {
    dispatch(showNotification('Something wrong', true));
  }
};

export const removeBlog = (blog) => async (dispatch) => {
  try {
    await blogsService.remove(blog.id);
    dispatch(filterBlog(blog));
    dispatch(showNotification(`remove blog ${blog.title} by ${blog.author}`));
  } catch (err) {
    dispatch(showNotification('Something wrong', true));
  }
};

export const addComment = (id, comment) => async (dispatch) => {
  try {
    const blog = await blogsService.comment(id, comment);
    dispatch(setBlog(blog));
  } catch (err) {
    dispatch(showNotification('Something wrong', true));
  }
};
