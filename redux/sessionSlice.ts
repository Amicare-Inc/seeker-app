import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
	collection,
	query,
	where,
	getDocs,
	onSnapshot,
	updateDoc,
	doc,
	arrayUnion,
} from 'firebase/firestore';
import { FIREBASE_DB } from '@/firebase.config';
import { Session } from '@/types/Sessions';
import { AppDispatch, RootState } from '@/redux/store';
import { EnrichedSession } from '@/types/EnrichedSession';
import { getUserSessionTab } from '@/services/node-express-backend/session';

// Real-time listener for session updates
export const listenToUserSessions = (dispatch: any, userId: string) => {
	const sessionCollection = collection(FIREBASE_DB, 'sessions_test1');
	const sessionQuery = query(
		sessionCollection,
		where('participants', 'array-contains', userId),
	);

	return onSnapshot(sessionQuery, (snapshot) => {
		const sessions = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		})) as Session[];

		// Remove any rejected, declined, or cancelled sessions
		const filteredSessions = sessions.filter(
			(s) => !['rejected', 'declined'].includes(s.status),
		);

		dispatch(setSessions(filteredSessions));
	});
};

// Update session status and remove rejected/declined sessions
export const updateSessionStatus = createAsyncThunk(
	'sessions/updateSessionStatus',
	async (
		{ sessionId, newStatus }: { sessionId: string; newStatus: string },
		{ rejectWithValue },
	) => {
		try {
			await updateDoc(doc(FIREBASE_DB, 'sessions_test1', sessionId), {
				status: newStatus,
			});
			return { sessionId, newStatus };
		} catch (error) {
			return rejectWithValue((error as any).message);
		}
	},
);

export const fetchUserSessionsFromBackend = createAsyncThunk<
	EnrichedSession[], // Expected return type from the backend
	string, // Argument type (userId)
	{ rejectValue: string } // Optional: type for rejectValue
>(
	'sessions/fetchUserSessionsFromBackend',
	async (userId: string, { rejectWithValue }) => {
		try {
			const sessions = await getUserSessionTab(userId);
			// Assuming backend returns an array of EnrichedSession
			return sessions as EnrichedSession[];
		} catch (error) {
			return rejectWithValue((error as any).message || 'Failed to fetch sessions');
		}
	});

// Return type from the thunk
type ConfirmBookingReturn = { sessionId: string; newStatus: string };

// Argument type
type ConfirmBookingArgs = {
	sessionId: string;
	currentUserId: string;
	existingConfirmedBy?: string[];
};

export const confirmSessionBookingThunk = createAsyncThunk<
	ConfirmBookingReturn, // return type
	ConfirmBookingArgs, // argument type
	{
		dispatch: AppDispatch;
		state: RootState;
		rejectValue: string; // or whatever type you prefer
	}
>(
	'sessions/confirmSessionBooking',
	async (
		{ sessionId, currentUserId, existingConfirmedBy },
		{ rejectWithValue },
	) => {
		try {
			const sessionRef = doc(FIREBASE_DB, 'sessions_test1', sessionId);
			// Add current user to confirmedBy
			await updateDoc(sessionRef, {
				confirmedBy: arrayUnion(currentUserId),
			});
			// Calculate the new count
			const prevCount = existingConfirmedBy
				? existingConfirmedBy.length
				: 0;
			const newCount = prevCount + 1;
			// If both users have confirmed, update the status to 'confirmed'
			if (newCount >= 2) {
				await updateDoc(sessionRef, { status: 'confirmed' });
				return { sessionId, newStatus: 'confirmed' };
			}
			// Otherwise, leave it as 'pending'
			return { sessionId, newStatus: 'pending' };
		} catch (error) {
			return rejectWithValue((error as any).message);
		}
	},
);

interface SessionState {
	allSessions: EnrichedSession[];
	activeEnrichedSession: EnrichedSession | null; // we'll store the active (enriched) session here
	newRequests: EnrichedSession[]; // Change from Session[]
	pending: EnrichedSession[]; // Change from Session[]
	confirmed: EnrichedSession[]; // Change from Session[]
	cancelled: EnrichedSession[]; // Change from Session[]
	inProgress: EnrichedSession[]; // Change from Session[]
	completed: EnrichedSession[]; // Change from Session[]
	failed: EnrichedSession[]; // Change from Session[]
	loading: boolean;
	error: string | null;
}

const initialState: SessionState = {
	allSessions: [],
	activeEnrichedSession: null,
	newRequests: [],
	pending: [],
	confirmed: [],
	cancelled: [],
	inProgress: [],
	completed: [],
	failed: [],
	loading: false,
	error: null,
};

const sessionSlice = createSlice({
	name: 'sessions',
	initialState,
	reducers: {
		setSessions(state, action: PayloadAction<EnrichedSession[]>) {
			state.allSessions = action.payload;
			state.newRequests = action.payload.filter(
				(s) =>
					s.status === 'newRequest' &&
					s.receiverId === (state as any).userId,
			);
			state.pending = action.payload.filter(
				(s) => s.status === 'pending',
			);
			state.confirmed = action.payload.filter(
				(s) => s.status === 'confirmed',
			);
			state.confirmed = action.payload.filter(
				(s) => s.status === 'cancelled',
			);
			state.confirmed = action.payload.filter(
				(s) => s.status === 'inProgress',
			);
			state.confirmed = action.payload.filter(
				(s) => s.status === 'completed',
			);
			state.confirmed = action.payload.filter(
				(s) => s.status === 'failed',
			);
		},
		clearSessions(state) {
			state.allSessions = [];
			state.newRequests = [];
			state.pending = [];
			state.confirmed = [];
		},
		setActiveEnrichedSession(
			state,
			action: PayloadAction<EnrichedSession | null>,
		) {
			state.activeEnrichedSession = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchUserSessionsFromBackend.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchUserSessionsFromBackend.fulfilled, (state, action) => {
				state.loading = false;
				state.allSessions = action.payload;
				// Re-filter the status arrays after fetching from the backend
				state.newRequests = state.allSessions.filter(
					(s) => s.status === 'newRequest' && s.receiverId === (state as any).userId
				);
				state.pending = state.allSessions.filter(
					(s) => s.status === 'pending'
				);
				state.confirmed = state.allSessions.filter(
					(s) => s.status === 'confirmed'
				);
				state.cancelled = state.allSessions.filter(
					(s) => s.status === 'cancelled'
				);
				state.inProgress = state.allSessions.filter(
					(s) => s.status === 'inProgress'
				);
				state.completed = state.allSessions.filter(
					(s) => s.status === 'completed'
				);
				state.failed = state.allSessions.filter(
					(s) => s.status === 'failed'
				);
			})
			.addCase(fetchUserSessionsFromBackend.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})

			.addCase(updateSessionStatus.fulfilled, (state, action) => {
				const { sessionId, newStatus } = action.payload;
				state.allSessions = state.allSessions.filter(
					(session) =>
						session.id !== sessionId ||
						!['rejected', 'declined'].includes(newStatus),
				);
				state.newRequests = state.allSessions.filter(
					(s) =>
						s.status === 'newRequest' &&
						s.receiverId === (state as any).userId,
				);
				state.pending = state.allSessions.filter(
					(s) => s.status === 'pending',
				);
				state.confirmed = state.allSessions.filter(
					(s) => s.status === 'confirmed',
				);
				state.cancelled = state.allSessions.filter(
					(s) => s.status === 'cancelled',
				);
				state.inProgress = state.allSessions.filter(
					(s) => s.status === 'inProgress',
				);
				state.completed = state.allSessions.filter(
					(s) => s.status === 'completed',
				);
				state.failed = state.allSessions.filter(
					(s) => s.status === 'failed',
				);
			});
	},
});

export const { setSessions, clearSessions, setActiveEnrichedSession } =
	sessionSlice.actions;
export default sessionSlice.reducer;

// DEPRECIATED
// // Fetch all sessions where the user is a participant (excluding rejected/cancelled)
// export const fetchUserSessions = createAsyncThunk(
//   'sessions/fetchUserSessions',
//   async (userId: string, { rejectWithValue }) => {
//     try {
//       const q = query(
//         collection(FIREBASE_DB, 'sessions_test1'),
//         where('participants', 'array-contains', userId),
//         where('status', 'not-in', ['rejected', 'declined', 'cancelled']) // Exclude rejected, declined, and cancelled sessions
//       );
//       const querySnapshot = await getDocs(q);
//       console.log('USER SESSIONS REDUX:', querySnapshot);
//       const sessions: Session[] = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       })) as Session[];

//       return sessions;
//     } catch (error) {
//       return rejectWithValue((error as any).message);
//     }
//   }
// );
