import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchExploreUsers, fetchExploreUsersWithDistance } from '@/src/features/userDirectory';
import { User } from '@/types/User';
import { RootState } from './store';

interface FetchUsersArgs {
	isPsw: boolean;
}

export const fetchAvailableUsers = createAsyncThunk(
	'usersList/fetchAvailableUsers',
	async ({ isPsw }: FetchUsersArgs, { getState, rejectWithValue }) => {
		const state = getState() as RootState;
		const currentUserId = state.user.userData?.id;

		if (!currentUserId) {
			return rejectWithValue('No current user found');
		}

		try {
			// Determine the user type to fetch (opposite of current user)
			const userType = isPsw ? 'psw' : 'seeker';
			
			const availableUsers = await fetchExploreUsers(userType, currentUserId);
			return availableUsers as User[];
		} catch (error) {
			return rejectWithValue((error as any).message);
		}
	},
);

export const fetchAvailableUsersWithDistance = createAsyncThunk(
	'usersList/fetchAvailableUsersWithDistance',
	async ({ isPsw }: FetchUsersArgs, { getState, rejectWithValue }) => {
		const state = getState() as RootState;
		const currentUserId = state.user.userData?.id;

		if (!currentUserId) {
			return rejectWithValue('No current user found');
		}

		try {
			// Determine the user type to fetch (opposite of current user)
			const userType = isPsw ? 'psw' : 'seeker';
			
			const availableUsers = await fetchExploreUsersWithDistance(userType, currentUserId);
			return availableUsers as User[];
		} catch (error) {
			return rejectWithValue((error as any).message);
		}
	},
);

const usersListSlice = createSlice({
	name: 'usersList',
	initialState: {
		users: [] as User[],
		loading: false,
		error: null as string | null,
	},
	reducers: {
		clearUsers: (state) => {
			state.users = [];
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchAvailableUsers.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchAvailableUsers.fulfilled, (state, action) => {
				state.loading = false;
				state.users = action.payload;
			})
			.addCase(fetchAvailableUsers.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			.addCase(fetchAvailableUsersWithDistance.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchAvailableUsersWithDistance.fulfilled, (state, action) => {
				state.loading = false;
				state.users = action.payload;
			})
			.addCase(fetchAvailableUsersWithDistance.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
	},
});

export const { clearUsers } = usersListSlice.actions;
export default usersListSlice.reducer;
