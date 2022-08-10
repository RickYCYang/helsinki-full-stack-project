import { createSlice } from '@reduxjs/toolkit';
import { showNotification } from './notificationReducer';
import blogsService from '../../services/blogs';
import loginService from '../../services/login';
import usersService from '../../services/users';

const initialState = {
  user: {},
  users: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
  },
});

export const { setUser, setUsers } = userSlice.actions;
export default userSlice.reducer;

export const login = (user) => async (dispatch) => {
  try {
    const loginedUser = await loginService.login(user);
    window.localStorage.setItem(
      'loggedBlogappUser',
      JSON.stringify(loginedUser)
    );
    blogsService.setToken(loginedUser.token);
    dispatch(setUser(loginedUser));
  } catch (exception) {
    dispatch(showNotification('Wrong username or password', true));
  }
};

export const chkLogined = () => (dispatch) => {
  const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
  if (loggedUserJSON) {
    const loginedUser = JSON.parse(loggedUserJSON);
    dispatch(setUser(loginedUser));
    blogsService.setToken(loginedUser.token);
  }
};

export const logout = () => (dispatch) => {
  window.localStorage.removeItem('loggedBlogappUser');
  dispatch(setUser(null));
};

export const fetchUsers = () => async (dispatch) => {
  const users = await usersService.getAll();
  dispatch(setUsers(users));
};
