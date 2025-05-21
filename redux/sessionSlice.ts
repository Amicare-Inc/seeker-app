import { createSlice, createAsyncThunk, PayloadAction, current } from '@reduxjs/toolkit';
import { collection, query, where, onSnapshot, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { FIREBASE_DB } from '@/firebase.config';
import { Session } from '@/types/Sessions';
import { AppDispatch, RootState } from '@/redux/store';
import { EnrichedSession } from '@/types/EnrichedSession';
import { acceptSession, bookSession, cancelSession, declineSession, getUserSessionTab, rejectSession } from '@/services/node-express-backend/session';

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
	}
);

export const acceptSessionThunk = createAsyncThunk<
	Session, // Expected return type (the updated session)
	string, // Argument type (sessionId)
	{ rejectValue: string } // Optional: type for rejectValue
>(
	'sessions/acceptSession',
	async (sessionId: string, { rejectWithValue }) => {
		try {
			const updatedSession = await acceptSession(sessionId);
			return updatedSession;
		} catch (error) {
			return rejectWithValue((error as any).message || 'Failed to accept session');
		}
	}
);

export const rejectSessionThunk = createAsyncThunk<
	Session, // Expected return type (the updated session)
	string, // Argument type (sessionId)
	{ rejectValue: string } // Optional: type for rejectValue
>(
	'sessions/rejectSession',
	async (sessionId: string, { rejectWithValue }) => {
		try {
			const updatedSession = await rejectSession(sessionId);
			return updatedSession;
		} catch (error) {
			return rejectWithValue((error as any).message || 'Failed to reject session');
		}
	}
);

type BookSessionArgs = {
	sessionId: string;
	currentUserId: string;
};

export const bookSessionThunk = createAsyncThunk<
	Session, // Expected return type (the updated session)
	BookSessionArgs, // Argument type (sessionId)
	{
		dispatch: AppDispatch;
		state: RootState;
		rejectValue: string; // or whatever type you prefer
	}// Optional: type for rejectValue
>(
	'sessions/bookSession',
	async ({ sessionId, currentUserId }, { rejectWithValue }) => {
		try {
			const updatedSession = await bookSession(sessionId, currentUserId);
			return updatedSession;
		} catch (error) {
			return rejectWithValue((error as any).message || 'Failed to book session');
		}
	}
);

export const declineSessionThunk = createAsyncThunk<
	Session, // Expected return type (the updated session)
	string, // Argument type (sessionId)
	{ rejectValue: string } // Optional: type for rejectValue
>(
	'sessions/declineSession',
	async (sessionId: string, { rejectWithValue }) => {
		try {
			const updatedSession = await declineSession(sessionId);
			return updatedSession;
		} catch (error) {
			return rejectWithValue((error as any).message || 'Failed to decline session');
		}
	}
);

export const cancelSessionThunk = createAsyncThunk<
	Session, // Expected return type (the updated session)
	string, // Argument type (sessionId)
	{ rejectValue: string } // Optional: type for rejectValue
>(
	'sessions/cancelSession',
	async (sessionId: string, { rejectWithValue }) => {
		try {
			const updatedSession = await cancelSession(sessionId);
			return updatedSession;
		} catch (error) {
			return rejectWithValue((error as any).message || 'Failed to cancel session');
		}
	}
);

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
			})
			.addCase(fetchUserSessionsFromBackend.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			.addCase(acceptSessionThunk.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(acceptSessionThunk.fulfilled, (state, action) => {
				state.loading = false;
				const updatedSession = action.payload;
				const index = state.allSessions.findIndex(session => session.id === updatedSession.id);
				if (index !== -1) {
					const otherUser = state.allSessions[index].otherUser
					const enrichedSession = {
						...updatedSession,
						otherUser: otherUser,
					} as EnrichedSession;
					state.allSessions[index] = enrichedSession;
				}
			})
			.addCase(acceptSessionThunk.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			.addCase(rejectSessionThunk.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(rejectSessionThunk.fulfilled, (state, action) => {
				state.loading = false;
				const updatedSession = action.payload;
				const index = state.allSessions.findIndex(session => session.id === updatedSession.id);
				if (index !== -1) {
					const otherUser = state.allSessions[index].otherUser
					const enrichedSession = {
						...updatedSession,
						otherUser: otherUser,
					} as EnrichedSession;
					state.allSessions[index] = enrichedSession;
				}
			})
			.addCase(rejectSessionThunk.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			.addCase(bookSessionThunk.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(bookSessionThunk.fulfilled, (state, action) => {	
				state.loading = false;
				const updatedSession = action.payload;
				const index = state.allSessions.findIndex(session => session.id === updatedSession.id);
				if (index !== -1) {
					const otherUser = state.allSessions[index].otherUser
					const enrichedSession = {
						...updatedSession,
						otherUser: otherUser,
					} as EnrichedSession;
					state.allSessions[index] = enrichedSession;
				}
			})
			.addCase(bookSessionThunk.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			.addCase(declineSessionThunk.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(declineSessionThunk.fulfilled, (state, action) => {
				state.loading = false;
				const updatedSession = action.payload;
				const index = state.allSessions.findIndex(session => session.id === updatedSession.id);
				if (index !== -1) {
					const otherUser = state.allSessions[index].otherUser
					const enrichedSession = {
						...updatedSession,
						otherUser: otherUser,
					} as EnrichedSession;
					state.allSessions[index] = enrichedSession;
				}
			})
			.addCase(declineSessionThunk.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			.addCase(cancelSessionThunk.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(cancelSessionThunk.fulfilled, (state, action) => {
				state.loading = false;
				const updatedSession = action.payload;
				const index = state.allSessions.findIndex(session => session.id === updatedSession.id);
				if (index !== -1) {
					const otherUser = state.allSessions[index].otherUser
					const enrichedSession = {
						...updatedSession,
						otherUser: otherUser,
					} as EnrichedSession;
					state.allSessions[index] = enrichedSession;
				}
			})
			.addCase(cancelSessionThunk.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
	},
});

export const { setSessions, clearSessions, setActiveEnrichedSession } = sessionSlice.actions;
export default sessionSlice.reducer;
