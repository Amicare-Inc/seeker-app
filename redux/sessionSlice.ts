import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUserSessions, getUserDoc, updateSessionStatus } from '@/services/firebase/firestore';
import { Session } from "@/types/Sessions";
import { User } from '@/types/User';
import { FIREBASE_AUTH } from '@/firebase.config';

// Define the expected return type from fetchSessions
interface FetchSessionsResponse {
    pending: Session[];
    accepted: Session[];
    booked: Session[];
}

// Async Thunk for fetching sessions (this will include the Firebase listeners)
export const fetchSessions = createAsyncThunk('sessions/fetchSessions', async (_, { rejectWithValue }) => {
    const currentUserId = FIREBASE_AUTH.currentUser?.uid;
    try {
      const pendingSessions = await fetchUserSessions("pending", "targetUserId");
      const acceptedSessionsRequester = await fetchUserSessions("accepted", "requesterId");
      const acceptedSessionsTarget = await fetchUserSessions("accepted", "targetUserId");
      const bookedSessionsRequester = await fetchUserSessions("booked", "requesterId");
      const bookedSessionsTarget = await fetchUserSessions("booked", "targetUserId");
      console.log("pending redux ", pendingSessions)
      const acceptedSessions = [...acceptedSessionsRequester, ...acceptedSessionsTarget];
      const bookedSessions = [...bookedSessionsRequester, ...bookedSessionsTarget];
  
      // Maps to store user data
      const pendingMap: { [key: string]: User } = {};
      const acceptedMap: { [key: string]: User } = {};
      const bookedMap: { [key: string]: User } = {};
  
      // Fetch and populate maps with user data for pending sessions
      await Promise.all(pendingSessions.map(async (session) => {
        const userData = await getUserDoc(session.requesterId);  // Assuming getUserDoc fetches user data
        if (userData) {
          pendingMap[session.requesterId] = userData as User;
        }
      }));
  
      // Fetch and populate maps with user data for accepted sessions
      await Promise.all(acceptedSessions.map(async (session) => {
        const userIdToFetch = session.requesterId === currentUserId
          ? session.targetUserId
          : session.requesterId;
        const userData = await getUserDoc(userIdToFetch);
        if (userData) {
          acceptedMap[userIdToFetch] = userData as User;
        }
      }));
  
      // Fetch and populate maps with user data for booked sessions
      await Promise.all(bookedSessions.map(async (session) => {
        const userIdToFetch = session.requesterId === currentUserId
          ? session.targetUserId
          : session.requesterId;
        const userData = await getUserDoc(userIdToFetch);
        if (userData) {
          bookedMap[userIdToFetch] = userData as User;
        }
      }));
      console.log("Pending map", pendingMap)
  
      return {
        pending: pendingSessions,
        accepted: acceptedSessions,
        booked: bookedSessions,
        pendingMap,
        acceptedMap,
        bookedMap
      };
    } catch (error) {
      return rejectWithValue((error as any).message);
    }
  });

// Slice Definition
const sessionSlice = createSlice({
  name: 'sessions',
  initialState: {
    notConfirmedSessions: [] as Session[],
    confirmedSessions: [] as Session[],
    bookedSessions: [] as Session[],
    pendingMap: {} as { [key: string]: User },
    acceptedMap: {} as { [key: string]: User },
    bookedMap: {} as { [key: string]: User },
    loading: false,
    error: null as string | null,
  },
  reducers: {
    acceptSession(state, action) {
      // Move session from notConfirmedSessions to confirmedSessions
      const sessionToAccept = state.notConfirmedSessions.find(session => session.id === action.payload);
      if (sessionToAccept) {
        // Update the status to 'accepted'
        state.confirmedSessions = state.confirmedSessions.concat({ ...sessionToAccept, status: 'accepted' });
        
        // Remove the session from notConfirmedSessions
        state.notConfirmedSessions = state.notConfirmedSessions.filter(session => session.id !== action.payload);
        state.acceptedMap[sessionToAccept.requesterId] = state.pendingMap[sessionToAccept.requesterId];
        delete state.pendingMap[sessionToAccept.requesterId];  // Remove from pending map
      }
      console.log("ACCEPT PENDING CONFIRMED", state.confirmedSessions)
      console.log("ACCEPT PENDING NOT CONFIRMED", state.notConfirmedSessions)
    },
  
    rejectSession(state, action) {
      // Move session to rejected state (we can assume this would be a separate state, or handle it as filtering out)
      state.notConfirmedSessions = state.notConfirmedSessions.filter(session => session.id !== action.payload);
    },
  
    bookSession(state, action) {
      // Move session from confirmedSessions to bookedSessions
      const sessionToBook = state.confirmedSessions.find(session => session.id === action.payload);
      if (sessionToBook) {
        // Update the status to 'booked'
        console.log("SESSION TO BOOK: ",sessionToBook)
        state.bookedSessions = state.bookedSessions.concat({ ...sessionToBook, status: 'booked' });
        console.log("BOOKED SESSIONS IN IF: ",state.bookedSessions)
  
        // Remove the session from confirmedSessions
        state.confirmedSessions = state.confirmedSessions.filter(session => session.id !== action.payload);
        console.log("BOOKED REQUESTER", sessionToBook.requesterId)
        console.log("BOOKED TARGET", sessionToBook.targetUserId)
        if (sessionToBook.requesterId) {
            state.bookedMap[sessionToBook.requesterId] = state.acceptedMap[sessionToBook.requesterId];
            delete state.acceptedMap[sessionToBook.requesterId];
        }
        if (sessionToBook.targetUserId) {
            state.bookedMap[sessionToBook.targetUserId] = state.acceptedMap[sessionToBook.targetUserId];
            delete state.acceptedMap[sessionToBook.targetUserId];
        }
      }
      console.log("ACCEPT BOOKED BOOKED", state.bookedSessions)
      console.log("ACCEPT BOOKED CONFIRMED", state.confirmedSessions)
    },
    rejectBookedSession(state, action) {
        // Move session to rejected state (we can assume this would be a separate state, or handle it as filtering out)
        state.confirmedSessions = state.confirmedSessions.filter(session => session.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.notConfirmedSessions = action.payload.pending;
        state.confirmedSessions = action.payload.accepted;
        state.bookedSessions = action.payload.booked;
        state.pendingMap = action.payload.pendingMap;
        state.acceptedMap = action.payload.acceptedMap;
        state.bookedMap = action.payload.bookedMap;
        state.loading = false;
        console.log('Redux state after fetch pending:', state.notConfirmedSessions);
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { acceptSession, rejectSession, bookSession, rejectBookedSession } = sessionSlice.actions;
export default sessionSlice.reducer;