// services/sessionService.ts
import { doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';
import { FIREBASE_DB } from '@/firebase.config';
import { Session } from '@/types/Sessions';

/** Listen to changes for a single session doc */
export function subscribeToSession(
  sessionId: string,
  callback: (updated: Session) => void
): () => void {
  const sessionRef = doc(FIREBASE_DB, 'sessions', sessionId);
  const unsubscribe = onSnapshot(sessionRef, (snap) => {
    if (snap.exists()) callback(snap.data() as Session);
  });
  return unsubscribe;
}

/** Add the current user to confirmedBy; if both are confirmed, set status=booked */
export async function confirmSessionBooking(
  sessionId: string,
  currentUserId: string,
  existingConfirmedBy?: string[]
) {
  const sessionRef = doc(FIREBASE_DB, 'sessions', sessionId);

  // add current user
  await updateDoc(sessionRef, {
    confirmedBy: arrayUnion(currentUserId),
  });

  // if the session was confirmed by exactly one user prior, it’s now fully booked
  if (existingConfirmedBy && existingConfirmedBy.length === 1) {
    await updateDoc(sessionRef, { status: 'booked' });
  }
}

/** Cancel or reject session depending on current status */
export async function cancelSession(sessionId: string, currentStatus: string) {
  const sessionRef = doc(FIREBASE_DB, 'sessions', sessionId);
  const newStatus = currentStatus === 'booked' ? 'cancelled' : 'rejected';
  await updateDoc(sessionRef, { status: newStatus });
}