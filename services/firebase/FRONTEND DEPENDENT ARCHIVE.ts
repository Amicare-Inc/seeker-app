// import { onSnapshot, query, where, collection } from 'firebase/firestore';
// import { FIREBASE_DB, FIREBASE_AUTH } from '@/firebase.config';
// import { AppDispatch } from '@/redux/store';
// import { setPendingSessions, setAcceptedSessions, setBookedSessions, removePendingSession, removeAcceptedSession } from '@/redux/sessionSlice';
// import { getUserDoc } from '@/services/firebase/firestore'; // The function to fetch user data
// import { Session } from '@/types/Sessions';
// import { User } from '@/types/User';


//ARCHIVES
// // Listener Function
// export const oldListenToUserSessions = (dispatch: AppDispatch) => {
//   const currentUserId = FIREBASE_AUTH.currentUser?.uid;
// //   if (!currentUserId) return; // Make sure the user is authenticated

//   const sessionCollection = collection(FIREBASE_DB, 'sessions');

//   // Query for pending sessions
//   const pendingQuery = query(
//     sessionCollection,
//     where("targetUserId", "==", currentUserId),
//     where("status", "==", "pending")
//   );

//   // Queries for accepted sessions (requester and target)
//   const acceptedTargetQuery = query(
//     sessionCollection,
//     where("targetUserId", "==", currentUserId),
//     where("status", "==", "accepted")
//   );
//   const acceptedRequesterQuery = query(
//     sessionCollection,
//     where("requesterId", "==", currentUserId),
//     where("status", "==", "accepted")
//   );

//   // Queries for booked sessions (requester and target)
//   const bookedTargetQuery = query(
//     sessionCollection,
//     where("targetUserId", "==", currentUserId),
//     where("status", "==", "booked")
//   );
//   const bookedRequesterQuery = query(
//     sessionCollection,
//     where("requesterId", "==", currentUserId),
//     where("status", "==", "booked")
//   );

//   // Function to map sessions with user data
//   const mapSessionsWithUserData = async (sessions: Session[]) => {
//     const sessionMap: { [key: string]: User } = {};

//     await Promise.all(sessions.map(async (session) => {
//       // Determine which user ID to fetch (requester or target)
//       const userIdToFetch = session.requesterId === currentUserId
//         ? session.targetUserId
//         : session.requesterId;

//       // Fetch user data
//       const userData = await getUserDoc(userIdToFetch);
//       if (userData) {
//         sessionMap[userIdToFetch] = userData as User;
//       }
//     }));

//     return sessionMap;
//   };

//   // Set up listener for pending sessions
//   onSnapshot(pendingQuery, async (snapshot) => {
//     const sessions = snapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data(),
//     } as Session));

//     console.log("ACCEPTED LISTENER", sessions, FIREBASE_AUTH.currentUser?.email)

//     // Check for rejection updates and remove rejected sessions
//     snapshot.docChanges().forEach(change => {
//         const status = change.doc.data().status;
//         if (status === 'reject_pending') {
//             dispatch(removePendingSession(change.doc.id));
//         }
//     });

//     // Map with user data
//     const pendingMap = await mapSessionsWithUserData(sessions);
//     dispatch(setPendingSessions({ sessions, pendingMap }));
//   });

//   // Set up listeners for accepted sessions
//   onSnapshot(acceptedTargetQuery, async (snapshot) => {
//     const targetSessions = snapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data(),
//     } as Session)).filter(session => session.status === 'accepted');

//     onSnapshot(acceptedRequesterQuery, async (reqSnapshot) => {
//       const requesterSessions = reqSnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data(),
//     } as Session)).filter(session => session.status === 'accepted');

//     const combinedAcceptedSessions = [...targetSessions, ...requesterSessions];
//     console.log("ACCEPTED LISTENER", combinedAcceptedSessions, FIREBASE_AUTH.currentUser?.email)

//     // Check for rejection updates and remove rejected sessions
//     snapshot.docChanges().forEach(change => {
//         const status = change.doc.data().status;
//         if (status === 'reject_accepted') {
//             dispatch(removeAcceptedSession(change.doc.id));
//         }
//     });

//       // Map with user data
//     const acceptedMap = await mapSessionsWithUserData(combinedAcceptedSessions);
//     dispatch(setAcceptedSessions({ sessions: combinedAcceptedSessions, acceptedMap }));
//     });
//   });

//   // Set up listeners for booked sessions
//   onSnapshot(bookedTargetQuery, async (snapshot) => {
//     const targetSessions = snapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data(),
//     } as Session)).filter(session => session.status === 'booked');

//     onSnapshot(bookedRequesterQuery, async (reqSnapshot) => {
//       const requesterSessions = reqSnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data(),
//       } as Session)).filter(session => session.status === 'booked');

//       const combinedBookedSessions = [...targetSessions, ...requesterSessions];

//       // Map with user data
//       const bookedMap = await mapSessionsWithUserData(combinedBookedSessions);
//       dispatch(setBookedSessions({ sessions: combinedBookedSessions, bookedMap }));
//     });
//   });
// };

// Real-time listener for session updates NEED TO MOVE TO BACKEND
// export const listenToUserSessions = (dispatch: any, userId: string) => {
// 	const sessionCollection = collection(FIREBASE_DB, 'sessions_test1');
// 	const sessionQuery = query(
// 		sessionCollection,
// 		where('participants', 'array-contains', userId),
// 	);

// 	return onSnapshot(sessionQuery, (snapshot) => {
// 		const sessions = snapshot.docs.map((doc) => ({
// 			id: doc.id,
// 			...doc.data(),
// 		})) as Session[];

// 		// Remove any rejected, declined, or cancelled sessions
// 		const filteredSessions = sessions.filter(
// 			(s) => !['rejected', 'declined'].includes(s.status),
// 		);

// 		dispatch(setSessions(filteredSessions));
// 	});
// };

// Update session status and remove rejected/declined sessions
// export const updateSessionStatus = createAsyncThunk(
// 	'sessions/updateSessionStatus',
// 	async (
// 		{ sessionId, newStatus }: { sessionId: string; newStatus: string },
// 		{ rejectWithValue },
// 	) => {
// 		try {
// 			await updateDoc(doc(FIREBASE_DB, 'sessions_test1', sessionId), {
// 				status: newStatus,
// 			});
// 			return { sessionId, newStatus };
// 		} catch (error) {
// 			return rejectWithValue((error as any).message);
// 		}
// 	},
// );

// .addCase(updateSessionStatus.fulfilled, (state, action) => {
//                 const { sessionId, newStatus } = action.payload;
//                 state.allSessions = state.allSessions.filter(
//                     (session) =>
//                         session.id !== sessionId ||
//                         !['rejected', 'declined'].includes(newStatus),
//                 );
//                 // Note: This thunk is likely using direct Firestore access
//                 // and should ideally be refactored to use the backend API
//                 // if you want consistent data flow. If it remains,
//                 // you might need to decide how its status update affects
//                 // allSessions and whether a fetch is needed afterward.
//             })


// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { fetchUserSessions, getUserDoc, updateSessionStatus } from '@/services/firebase/firestore';
// import { Session } from "@/types/Sessions";
// import { User } from '@/types/User';
// import { FIREBASE_AUTH } from '@/firebase.config';

// // Define the expected return type from fetchSessions
// interface FetchSessionsResponse {
//     pending: Session[];
//     accepted: Session[];
//     booked: Session[];
// }

// // Async Thunk for fetching sessions (this will include the Firebase listeners)
// export const fetchSessions = createAsyncThunk('sessions/fetchSessions', async (_, { rejectWithValue }) => {
//     const currentUserId = FIREBASE_AUTH.currentUser?.uid;
//     try {
//       const pendingSessions = await fetchUserSessions("pending", "targetUserId");
//       const acceptedSessionsRequester = await fetchUserSessions("accepted", "requesterId");
//       const acceptedSessionsTarget = await fetchUserSessions("accepted", "targetUserId");
//       const bookedSessionsRequester = await fetchUserSessions("booked", "requesterId");
//       const bookedSessionsTarget = await fetchUserSessions("booked", "targetUserId");
//       console.log("pending redux ", pendingSessions)
//       const acceptedSessions = [...acceptedSessionsRequester, ...acceptedSessionsTarget];
//       const bookedSessions = [...bookedSessionsRequester, ...bookedSessionsTarget];

//       // Maps to store user data
//       const pendingMap: { [key: string]: User } = {};
//       const acceptedMap: { [key: string]: User } = {};
//       const bookedMap: { [key: string]: User } = {};

//       // Fetch and populate maps with user data for pending sessions
//       await Promise.all(pendingSessions.map(async (session) => {
//         const userData = await getUserDoc(session.requesterId);  // Assuming getUserDoc fetches user data
//         if (userData) {
//           pendingMap[session.requesterId] = userData as User;
//         }
//       }));

//       // Fetch and populate maps with user data for accepted sessions
//       await Promise.all(acceptedSessions.map(async (session) => {
//         const userIdToFetch = session.requesterId === currentUserId
//           ? session.targetUserId
//           : session.requesterId;
//         const userData = await getUserDoc(userIdToFetch);
//         if (userData) {
//           acceptedMap[userIdToFetch] = userData as User;
//         }
//       }));

//       // Fetch and populate maps with user data for booked sessions
//       await Promise.all(bookedSessions.map(async (session) => {
//         const userIdToFetch = session.requesterId === currentUserId
//           ? session.targetUserId
//           : session.requesterId;
//         const userData = await getUserDoc(userIdToFetch);
//         if (userData) {
//           bookedMap[userIdToFetch] = userData as User;
//         }
//       }));
//       console.log("Pending map", pendingMap)

//       return {
//         pending: pendingSessions,
//         accepted: acceptedSessions,
//         booked: bookedSessions,
//         pendingMap,
//         acceptedMap,
//         bookedMap
//       };
//     } catch (error) {
//       return rejectWithValue((error as any).message);
//     }
//   });

// // Slice Definition
// const sessionSlice = createSlice({
//   name: 'sessions',
//   initialState: {
//     notConfirmedSessions: [] as Session[],
//     confirmedSessions: [] as Session[],
//     bookedSessions: [] as Session[],
//     pendingMap: {} as { [key: string]: User },
//     acceptedMap: {} as { [key: string]: User },
//     bookedMap: {} as { [key: string]: User },
//     loading: false,
//     error: null as string | null,
//   },
//   reducers: {
//     acceptSession(state, action) {
//       // Move session from notConfirmedSessions to confirmedSessions
//       const sessionToAccept = state.notConfirmedSessions.find(session => session.id === action.payload);
//       if (sessionToAccept) {
//         // Update the status to 'accepted'
//         state.confirmedSessions = state.confirmedSessions.concat({ ...sessionToAccept, status: 'accepted' });

//         // Remove the session from notConfirmedSessions
//         state.notConfirmedSessions = state.notConfirmedSessions.filter(session => session.id !== action.payload);
//         state.acceptedMap[sessionToAccept.requesterId] = state.pendingMap[sessionToAccept.requesterId];
//         delete state.pendingMap[sessionToAccept.requesterId];  // Remove from pending map
//       }
//       console.log("ACCEPT PENDING CONFIRMED", state.confirmedSessions)
//       console.log("ACCEPT PENDING NOT CONFIRMED", state.notConfirmedSessions)
//     },

//     rejectSession(state, action) {
//       // Move session to rejected state (we can assume this would be a separate state, or handle it as filtering out)
//       state.notConfirmedSessions = state.notConfirmedSessions.filter(session => session.id !== action.payload);
//     },

//     bookSession(state, action) {
//       // Move session from confirmedSessions to bookedSessions
//       const sessionToBook = state.confirmedSessions.find(session => session.id === action.payload);
//       if (sessionToBook) {
//         // Update the status to 'booked'
//         console.log("SESSION TO BOOK: ",sessionToBook)
//         state.bookedSessions = state.bookedSessions.concat({ ...sessionToBook, status: 'booked' });
//         console.log("BOOKED SESSIONS IN IF: ",state.bookedSessions)

//         // Remove the session from confirmedSessions
//         state.confirmedSessions = state.confirmedSessions.filter(session => session.id !== action.payload);
//         console.log("BOOKED REQUESTER", sessionToBook.requesterId)
//         console.log("BOOKED TARGET", sessionToBook.targetUserId)
//         if (sessionToBook.requesterId) {
//             state.bookedMap[sessionToBook.requesterId] = state.acceptedMap[sessionToBook.requesterId];
//             delete state.acceptedMap[sessionToBook.requesterId];
//         }
//         if (sessionToBook.targetUserId) {
//             state.bookedMap[sessionToBook.targetUserId] = state.acceptedMap[sessionToBook.targetUserId];
//             delete state.acceptedMap[sessionToBook.targetUserId];
//         }
//       }
//       console.log("ACCEPT BOOKED BOOKED", state.bookedSessions)
//       console.log("ACCEPT BOOKED CONFIRMED", state.confirmedSessions)
//     },
//     rejectBookedSession(state, action) {
//         // Move session to rejected state (we can assume this would be a separate state, or handle it as filtering out)
//         state.confirmedSessions = state.confirmedSessions.filter(session => session.id !== action.payload);
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchSessions.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchSessions.fulfilled, (state, action) => {
//         state.notConfirmedSessions = action.payload.pending;
//         state.confirmedSessions = action.payload.accepted;
//         state.bookedSessions = action.payload.booked;
//         state.pendingMap = action.payload.pendingMap;
//         state.acceptedMap = action.payload.acceptedMap;
//         state.bookedMap = action.payload.bookedMap;
//         state.loading = false;
//         console.log('Redux state after fetch pending:', state.notConfirmedSessions);
//       })
//       .addCase(fetchSessions.rejected, (state, action) => {
//         state.error = action.payload as string;
//         state.loading = false;
//       });
//   },
// });

// export const { acceptSession, rejectSession, bookSession, rejectBookedSession } = sessionSlice.actions;
// export default sessionSlice.reducer;


// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { Session } from '@/types/Sessions';
// import { User } from '@/types/User';

// interface SessionState {
//   notConfirmedSessions: Session[];
//   confirmedSessions: Session[];
//   bookedSessions: Session[];
//   pendingMap: { [key: string]: User };
//   acceptedMap: { [key: string]: User };
//   bookedMap: { [key: string]: User };
//   loading: boolean;
//   error: string | null;
// }

// const initialState: SessionState = {
//   notConfirmedSessions: [],
//   confirmedSessions: [],
//   bookedSessions: [],
//   pendingMap: {},
//   acceptedMap: {},
//   bookedMap: {},
//   loading: false,
//   error: null,
// };

// const sessionSlice = createSlice({
//   name: 'sessions',
//   initialState,
//   reducers: {
//     setPendingSessions(state, action: PayloadAction<{ sessions: Session[], pendingMap: { [key: string]: User } }>) {
//       state.notConfirmedSessions = action.payload.sessions;
//       state.pendingMap = action.payload.pendingMap;
//     },
//     setAcceptedSessions(state, action: PayloadAction<{ sessions: Session[], acceptedMap: { [key: string]: User } }>) {
//       state.confirmedSessions = action.payload.sessions.filter(session => session.status === 'accepted');
//       state.acceptedMap = action.payload.acceptedMap;
//     },
//     setBookedSessions(state, action: PayloadAction<{ sessions: Session[], bookedMap: { [key: string]: User } }>) {
//       state.bookedSessions = action.payload.sessions.filter(session => session.status === 'booked');
//       state.bookedMap = action.payload.bookedMap;
//     },
//     removePendingSession(state, action: PayloadAction<string>) {
//       state.notConfirmedSessions = state.notConfirmedSessions.filter(session => session.id !== action.payload);
//       delete state.pendingMap[action.payload];
//     },
//     removeAcceptedSession(state, action: PayloadAction<string>) {
//       state.confirmedSessions = state.confirmedSessions.filter(session => session.id !== action.payload);
//       delete state.acceptedMap[action.payload];
//     },
//     removeBookedSession(state, action: PayloadAction<string>) {
//       state.bookedSessions = state.bookedSessions.filter(session => session.id !== action.payload);
//       delete state.bookedMap[action.payload];
//     },
//     setError(state, action: PayloadAction<string>) {
//       state.error = action.payload;
//     },
//     updateSessionStatus(state, action: PayloadAction<{ sessionId: string, status: string }>) {
//         const { sessionId, status } = action.payload;

//         // Loop through each session list to find and update the session
//         for (const list of ['notConfirmedSessions', 'confirmedSessions', 'bookedSessions'] as const) {
//           // Cast the list to an array of Session to access findIndex
//           const sessionList = state[list as keyof SessionState] as Session[];
//           const sessionIndex = sessionList?.findIndex(session => session.id === sessionId) ?? -1;

//           if (sessionIndex !== -1) {
//             const session = sessionList[sessionIndex];
//             session.status = status; // Update the status of the session

//             // Move the session to the appropriate list based on the new status
//             if (status === 'booked') {
//               state.bookedSessions.push(session);
//             } else if (status === 'accepted') {
//               state.confirmedSessions.push(session);
//             } else if (status === 'pending') {
//               state.notConfirmedSessions.push(session);
//             }

//             // Remove the session from the original list
//             sessionList.splice(sessionIndex, 1);
//             break;
//           }
//         }
//       },
//   },
// });

// export const {
//   setPendingSessions,
//   setAcceptedSessions,
//   setBookedSessions,
//   removePendingSession,
//   removeAcceptedSession,
//   removeBookedSession,
//   setError,
//   updateSessionStatus
// } = sessionSlice.actions;

// export default sessionSlice.reducer;
