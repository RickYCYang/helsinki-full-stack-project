import { createSlice } from '@reduxjs/toolkit';

const initialState = '';

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification: (state, action) => {
      return action.payload;
    },
    removeNotification: (state, action) => {
      return '';
    },
  },
});

export const { setNotification, removeNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;

let timeoutId = '';
export const showNotification =
  (notification, duration) => async (dispatch) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    dispatch(setNotification(notification));
    timeoutId = setTimeout(() => {
      dispatch(removeNotification());
    }, duration * 1000);
  };
