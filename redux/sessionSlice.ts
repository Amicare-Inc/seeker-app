import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Session } from '@/types/Sessions';
import { User } from '@/types/User';

interface SessionState {
  notConfirmedSessions: Session[];
  confirmedSessions: Session[];
  bookedSessions: Session[];
  pendingMap: { [key: string]: User };
  acceptedMap: { [key: string]: User };
  bookedMap: { [key: string]: User };
  loading: boolean;
  error: string | null;
}

const initialState: SessionState = {
  notConfirmedSessions: [],
  confirmedSessions: [],
  bookedSessions: [],
  pendingMap: {},
  acceptedMap: {},
  bookedMap: {},
  loading: false,
  error: null,
};

const sessionSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    setPendingSessions(state, action: PayloadAction<{ sessions: Session[], pendingMap: { [key: string]: User } }>) {
      state.notConfirmedSessions = action.payload.sessions;
      state.pendingMap = action.payload.pendingMap;
    },
    setAcceptedSessions(state, action: PayloadAction<{ sessions: Session[], acceptedMap: { [key: string]: User } }>) {
      state.confirmedSessions = action.payload.sessions.filter(session => session.status === 'accepted');
      state.acceptedMap = action.payload.acceptedMap;
    },
    setBookedSessions(state, action: PayloadAction<{ sessions: Session[], bookedMap: { [key: string]: User } }>) {
      state.bookedSessions = action.payload.sessions.filter(session => session.status === 'booked');
      state.bookedMap = action.payload.bookedMap;
    },
    removePendingSession(state, action: PayloadAction<string>) {
      state.notConfirmedSessions = state.notConfirmedSessions.filter(session => session.id !== action.payload);
      delete state.pendingMap[action.payload];
    },
    removeAcceptedSession(state, action: PayloadAction<string>) {
      state.confirmedSessions = state.confirmedSessions.filter(session => session.id !== action.payload);
      delete state.acceptedMap[action.payload];
    },
    removeBookedSession(state, action: PayloadAction<string>) {
      state.bookedSessions = state.bookedSessions.filter(session => session.id !== action.payload);
      delete state.bookedMap[action.payload];
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const {
  setPendingSessions,
  setAcceptedSessions,
  setBookedSessions,
  removePendingSession,
  removeAcceptedSession,
  removeBookedSession,
  setError,
} = sessionSlice.actions;

export default sessionSlice.reducer;