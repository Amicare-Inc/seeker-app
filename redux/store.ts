import { configureStore } from '@reduxjs/toolkit';
import sessionReducer from './sessionSlice';
import userReducer from './userSlice';
import userListReducer from './userListSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    userList: userListReducer,
    sessions: sessionReducer, // You can add more slices here later
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;