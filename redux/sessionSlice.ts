import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { collection, query, where, getDocs, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { FIREBASE_DB } from '@/firebase.config';
import { Session } from '@/types/Sessions';
import { RootState } from '@/redux/store';
import { EnrichedSession } from '@/types/EnrichedSession';

// Fetch all sessions where the user is a participant (excluding rejected/cancelled)
export const fetchUserSessions = createAsyncThunk(
  'sessions/fetchUserSessions',
  async (userId: string, { rejectWithValue }) => {
    try {
      const q = query(
        collection(FIREBASE_DB, 'sessions_test1'),
        where('participants', 'array-contains', userId),
        where('status', 'not-in', ['rejected', 'declined', 'cancelled']) // Exclude rejected, declined, and cancelled sessions
      );
      const querySnapshot = await getDocs(q);
      console.log('USER SESSIONS REDUX:', querySnapshot);
      const sessions: Session[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Session[];

      return sessions;
    } catch (error) {
      return rejectWithValue((error as any).message);
    }
  }
);

// Real-time listener for session updates
export const listenToUserSessions = (dispatch: any, userId: string) => {
  const sessionCollection = collection(FIREBASE_DB, 'sessions_test1');
  const sessionQuery = query(sessionCollection, where('participants', 'array-contains', userId));

  return onSnapshot(sessionQuery, (snapshot) => {
    const sessions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Session[];

    // Remove any rejected, declined, or cancelled sessions
    const filteredSessions = sessions.filter(
      (s) => !["rejected", "declined", "cancelled"].includes(s.status)
    );

    dispatch(setSessions(filteredSessions));
  });
};

// Update session status and remove rejected/declined sessions
export const updateSessionStatus = createAsyncThunk(
  'sessions/updateSessionStatus',
  async ({ sessionId, newStatus }: { sessionId: string; newStatus: string }, { rejectWithValue }) => {
    try {
      await updateDoc(doc(FIREBASE_DB, 'sessions_test1', sessionId), { status: newStatus });
      return { sessionId, newStatus };
    } catch (error) {
      return rejectWithValue((error as any).message);
    }
  }
);

interface SessionState {
  allSessions: Session[];
  activeEnrichedSession: EnrichedSession | null; // we'll store the active (enriched) session here
  newRequests: Session[];
  pending: Session[];
  confirmed: Session[];
  loading: boolean;
  error: string | null;
}

const initialState: SessionState = {
  allSessions: [],
  activeEnrichedSession: null,
  newRequests: [],
  pending: [],
  confirmed: [],
  loading: false,
  error: null,
};

const sessionSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    setSessions(state, action: PayloadAction<Session[]>) {
      state.allSessions = action.payload;
      state.newRequests = action.payload.filter(
        (s) => s.status === 'newRequest' && s.receiverId === (state as any).userId
      );
      state.pending = action.payload.filter((s) => s.status === 'pending');
      state.confirmed = action.payload.filter((s) => s.status === 'confirmed');
    },
    clearSessions(state) {
      state.allSessions = [];
      state.newRequests = [];
      state.pending = [];
      state.confirmed = [];
    },
    setActiveEnrichedSession(state, action: PayloadAction<EnrichedSession>) {
      state.activeEnrichedSession = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.allSessions = action.payload;
        state.newRequests = action.payload.filter(
          (s) => s.status === 'newRequest' && s.receiverId === (state as any).userId
        );
        state.pending = action.payload.filter((s) => s.status === 'pending');
        state.confirmed = action.payload.filter((s) => s.status === 'confirmed');
      })
      .addCase(fetchUserSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateSessionStatus.fulfilled, (state, action) => {
        const { sessionId, newStatus } = action.payload;
        state.allSessions = state.allSessions.filter(
          (session) => session.id !== sessionId || !["rejected", "declined", "cancelled"].includes(newStatus)
        );
        state.newRequests = state.allSessions.filter(
          (s) => s.status === 'newRequest' && s.receiverId === (state as any).userId
        );
        state.pending = state.allSessions.filter((s) => s.status === 'pending');
        state.confirmed = state.allSessions.filter((s) => s.status === 'confirmed');
      });
  },
});

export const { setSessions, clearSessions, setActiveEnrichedSession } = sessionSlice.actions;
export default sessionSlice.reducer;