// services/sessionService.ts
import { doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';
import { FIREBASE_DB } from '@/firebase.config';
import { Session } from '@/types/Sessions';

/** Listen to changes for a single session doc */
export function subscribeToSession(
	sessionId: string,
	callback: (session: Session) => void,
) {
	const sessionRef = doc(FIREBASE_DB, 'sessions_test1', sessionId);
	return onSnapshot(sessionRef, (docSnap) => {
		if (docSnap.exists()) {
			callback(docSnap.data() as Session);
		} else {
			console.error('No session data found for ID:', sessionId);
		}
	});
}

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

	// useEffect(() => {
		// const unsubscribe = fetchMessages(sessionId as string, setMessages);
	// 	return () => unsubscribe();
	// }, [sessionId]);

	// const fetchMessages = (
	// 	sessionId: string,
	// 	callback: (msgs: Message[]) => void,
	// ) => {
	// 	const messagesRef = collection(
	// 		FIREBASE_DB,
	// 		'sessions_test1',
	// 		sessionId,
	// 		'messages',
	// 	);
	// 	const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));
	// 	const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
	// 		const fetchedMessages: Message[] = snapshot.docs.map((doc) => ({
	// 			...doc.data(),
	// 			id: doc.id,
	// 		})) as Message[];
	// 		callback(fetchedMessages);
	// 	});
	// 	return unsubscribe;
	// };

	// const addMessage = async (
	// 	sessionId: string,
	// 	messageText: string,
	// 	userId: string,
	// ) => {
	// 	const messagesRef = collection(
	// 		FIREBASE_DB,
	// 		'sessions_test1',
	// 		sessionId,
	// 		'messages',
	// 	);
	// 	await addDoc(messagesRef, {
	// 		userId,
	// 		message: messageText,
	// 		sessionId,
	// 		timestamp: new Date().toISOString(),
	// 	});
	// };

//DEPRECATED
// /** Add the current user to confirmedBy; if both are confirmed, set status=booked */

// export async function confirmSessionBooking(
//   sessionId: string,
//   currentUserId: string,
//   existingConfirmedBy?: string[]
// ) {
//   const sessionRef = doc(FIREBASE_DB, 'sessions_test1', sessionId);

//   // Add current user to confirmedBy array
//   await updateDoc(sessionRef, {
//     confirmedBy: arrayUnion(currentUserId),
//   });

//   // Determine new length: if existingConfirmedBy was undefined, treat as empty array.
//   const prevLength = existingConfirmedBy ? existingConfirmedBy.length : 0;
//   if (prevLength + 1 >= 2) {
//     // Both users have pressed Book, update status to 'confirmed'
//     await updateDoc(sessionRef, { status: 'confirmed' });
//   }
// }

// /** accept new session **/
// export async function acceptSession(sessionId: string, currentStatus: string) {
//   const sessionRef = doc(FIREBASE_DB, 'sessions_test1', sessionId);
//   const newStatus = 'pending';
//   await updateDoc(sessionRef, { status: newStatus });
// }

// /** reject new session **/
// export async function rejectSession(sessionId: string, currentStatus: string) {
//   const sessionRef = doc(FIREBASE_DB, 'sessions_test1', sessionId);
//   const newStatus = 'rejected';
//   await updateDoc(sessionRef, { status: newStatus });
// }

// /** Cancel confirmed session or decline pending session depending on current status */
// export async function cancelSession(sessionId: string, currentStatus: string) {
//   const sessionRef = doc(FIREBASE_DB, 'sessions_test1', sessionId);
//   const newStatus = currentStatus === 'confirmed' ? 'cancelled' : 'declined';
//   await updateDoc(sessionRef, { status: newStatus });
// }
