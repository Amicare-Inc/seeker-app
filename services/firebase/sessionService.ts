// services/sessionService.ts
import { doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';
import { FIREBASE_DB } from '@/firebase.config';
import { Session } from '@/types/Sessions';

/** Listen to changes for a single session doc */
export function subscribeToSession(
  sessionId: string,
  callback: (session: Session) => void
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