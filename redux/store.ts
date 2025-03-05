import { configureStore } from '@reduxjs/toolkit';
import sessionReducer from './sessionSlice';
import userReducer from './userSlice';
import userListReducer from './userListSlice';
import activeProfileReducer from './activeProfileSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    userList: userListReducer,
    sessions: sessionReducer, 
    activeProfile: activeProfileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;