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
	async ({email, password}, { rejectWithValue }) => {
		try {
			// Import Firebase auth here to avoid circular dependencies
			const { signInWithEmailAndPassword } = await import('firebase/auth');
			const { FIREBASE_AUTH } = await import('@/firebase.config');
			
			console.log('Attempting Firebase authentication...');
			
			// Authenticate with Firebase Auth (this verifies the password)
			const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
			const user = userCredential.user;
			
			console.log('Firebase authentication successful:', user.uid);
			
			// Now get the user profile from our backend using the verified user
			const userDoc = await AuthApi.signIn(email, password);
			if (!userDoc) {
				throw new Error('Failed to load user profile from backend');
			}
			
			console.log('User profile loaded successfully');
			return { ...userDoc } as User;
		} catch (error: any) {
			console.error('Login error:', error);
			
			// Handle Firebase Auth errors
			if (error.code === 'auth/user-not-found') {
				return rejectWithValue('No account found with this email address. Please sign up first.');
			} else if (error.code === 'auth/wrong-password') {
				return rejectWithValue('Incorrect password. Please try again.');
			} else if (error.code === 'auth/invalid-email') {
				return rejectWithValue('Invalid email address format.');
			} else if (error.code === 'auth/too-many-requests') {
				return rejectWithValue('Too many failed attempts. Please try again later.');
			} else if (error.message) {
				return rejectWithValue(error.message);
			} else {
				return rejectWithValue('Sign-in failed. Please check your credentials and try again.');
			}
		}
	},
);



// Extend your state interface to include an "allUsers" mapping
interface UserState {
	userData: User | null; // The current logged-in user
	allUsers: { [id: string]: User };
	initialNavigationComplete: boolean; // A mapping of all loaded users
	loading: boolean;
	error: string | null;
	tempFamilyMember: any | null; // Temporary storage for family member data during onboarding
	tempAvailability: { [day: string]: { start: string; end: string }[] } | null; // Temporary availability during onboarding
}

// Initialize with an empty mapping
const initialState: UserState = {
	userData: null,
	allUsers: {},
	initialNavigationComplete: false,
	loading: false,
	error: null,
	tempFamilyMember: null,
	tempAvailability: null,
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
		setTempFamilyMember(state, action: PayloadAction<any>) {
			state.tempFamilyMember = action.payload;
		},
		clearTempFamilyMember(state) {
			state.tempFamilyMember = null;
		},
		setTempAvailability(state, action: PayloadAction<{ [day: string]: { start: string; end: string }[] }>) {
			state.tempAvailability = action.payload;
		},
		clearTempAvailability(state) {
			state.tempAvailability = null;
		},
		clearError(state) {
			state.error = null;
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
				state.error = action.payload || action.error.message || 'Error fetching user';
			});
	},
});

export const {
	setUserData,
	clearUser,
	updateUserFields,
	upsertUser,
	setNavigationComplete,
	setTempFamilyMember,
	clearTempFamilyMember,
	setTempAvailability,
	clearTempAvailability,
	clearError,
} = userSlice.actions;
export default userSlice.reducer;
