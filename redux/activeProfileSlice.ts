// redux/activeProfileSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types/User';

interface ActiveProfileState {
	activeUser: User | null;
}

const initialState: ActiveProfileState = {
	activeUser: null,
};

const activeProfileSlice = createSlice({
	name: 'activeProfile',
	initialState,
	reducers: {
		setActiveProfile(state, action: PayloadAction<User>) {
			state.activeUser = action.payload;
		},
		clearActiveProfile(state) {
			state.activeUser = null;
		},
	},
});

export const { setActiveProfile, clearActiveProfile } =
	activeProfileSlice.actions;
export default activeProfileSlice.reducer;
