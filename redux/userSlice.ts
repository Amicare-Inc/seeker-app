import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types/User';
import { AppDispatch, RootState } from './store';
import { AuthApi } from '@/features/auth/api/authApi';

type fetchUserFromLoginArgs = {
	email: string;
	password: string;
};

export const fetchUserFromLoginThunk = createAsyncThunk<
	User, // Expected return type (User)
	fetchUserFromLoginArgs, // Argument type (fetchUserFromLoginArgs)
	{
		dispatch: AppDispatch;
		state: RootState;
		rejectValue: string; // or whatever type you prefer
	}
>(
	'user/fetchUserFromLogin',
	async ({email, password}) => {
		const userDoc = await AuthApi.signIn(email, password);
		if (!userDoc) {
			throw new Error('User doc not found from backend');
		}
		return { ...userDoc } as User;
	},
);



// Extend your state interface to include an "allUsers" mapping
interface UserState {
	userData: User | null; // The current logged-in user
	allUsers: { [id: string]: User };
	initialNavigationComplete: boolean; // A mapping of all loaded users
	loading: boolean;
	error: string | null;
}

// Initialize with an empty mapping
const initialState: UserState = {
	userData: null,
	allUsers: {},
	initialNavigationComplete: false,
	loading: false,
	error: null,
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		// Overwrite userData entirely and also update the allUsers map
		setUserData(state, action: PayloadAction<User>) {
			state.userData = action.payload;
			if (action.payload.id) {
				state.allUsers[action.payload.id] = action.payload;
			}
			state.initialNavigationComplete = true;
			state.loading = false;
			state.error = null;
		},
		// Optionally clear user data
		clearUser(state) {
			state.userData = null;
			state.loading = false;
			state.error = null;
			state.allUsers = {};
			state.initialNavigationComplete = false;
		},
		// Update only specific fields of userData and update the allUsers map accordingly
		updateUserFields(state, action: PayloadAction<Partial<User>>) {
			if (!state.userData) {
				state.userData = { ...action.payload } as User;
			} else {
				state.userData = { ...state.userData, ...action.payload };
			}
			if (state.userData) {
				state.allUsers[state.userData.id!] = state.userData;
			}
		},
		// NEW: Upsert a user into the allUsers mapping (for when you fetch other users)
		upsertUser(state, action: PayloadAction<User>) {
			if (action.payload.id) {
				state.allUsers[action.payload.id] = action.payload;
			}
		},
		setNavigationComplete(state, action: PayloadAction<boolean>) {
			state.initialNavigationComplete = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchUserFromLoginThunk.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchUserFromLoginThunk.fulfilled, (state, action: PayloadAction<User>) => {
				// Update current user and also store it in allUsers
				if (
					!state.userData ||
					state.userData.id === action.payload.id
				) {
					state.userData = action.payload;
				}
				if (action.payload.id) {
					state.allUsers[action.payload.id] = action.payload;
				}
				state.loading = false;
			})
			.addCase(fetchUserFromLoginThunk.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || 'Error fetching user';
			});
	},
});

export const {
	setUserData,
	clearUser,
	updateUserFields,
	upsertUser,
	setNavigationComplete,
} = userSlice.actions;
export default userSlice.reducer;
