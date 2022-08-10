import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  error: false,
  message: "",
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotification: (state, action) => {
      state.error = action.payload.error;
      state.message = action.payload.message;
    },
  },
});

export const { setNotification } = notificationSlice.actions;
export default notificationSlice.reducer;

let timeoutId = "";
export const showNotification =
  (message, error = false, duration = 5) =>
  async (dispatch) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    dispatch(setNotification({ message, error }));
    timeoutId = setTimeout(() => {
      dispatch(setNotification(""));
    }, duration * 1000);
  };
