import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import postSlice from './postSlice';
import notificationSlice from './notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    posts: postSlice,
    notifications: notificationSlice,
  },
});

export default store;
