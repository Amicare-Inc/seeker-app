import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import activeProfileReducer from './activeProfileSlice';

export const store = configureStore({
	reducer: {
		user: userReducer,
		activeProfile: activeProfileReducer,
	},
	devTools: true
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
