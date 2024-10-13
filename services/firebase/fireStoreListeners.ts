import { onSnapshot, query, where, collection } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '@/firebase.config';
import { AppDispatch } from '@/redux/store';
import { setPendingSessions, setAcceptedSessions, setBookedSessions, removePendingSession, removeAcceptedSession } from '@/redux/sessionSlice';
import { getUserDoc } from '@/services/firebase/firestore'; // The function to fetch user data
import { Session } from '@/types/Sessions';
import { User } from '@/types/User';

// Listener Function
export const listenToUserSessions = (dispatch: AppDispatch) => {
  const currentUserId = FIREBASE_AUTH.currentUser?.uid;
//   if (!currentUserId) return; // Make sure the user is authenticated

  const sessionCollection = collection(FIREBASE_DB, 'sessions');

  // Query for pending sessions
  const pendingQuery = query(
    sessionCollection,
    where("targetUserId", "==", currentUserId),
    where("status", "==", "pending")
  );

  // Queries for accepted sessions (requester and target)
  const acceptedTargetQuery = query(
    sessionCollection,
    where("targetUserId", "==", currentUserId),
    where("status", "==", "accepted")
  );
  const acceptedRequesterQuery = query(
    sessionCollection,
    where("requesterId", "==", currentUserId),
    where("status", "==", "accepted")
  );

  // Queries for booked sessions (requester and target)
  const bookedTargetQuery = query(
    sessionCollection,
    where("targetUserId", "==", currentUserId),
    where("status", "==", "booked")
  );
  const bookedRequesterQuery = query(
    sessionCollection,
    where("requesterId", "==", currentUserId),
    where("status", "==", "booked")
  );

  // Function to map sessions with user data
  const mapSessionsWithUserData = async (sessions: Session[]) => {
    const sessionMap: { [key: string]: User } = {};
    
    await Promise.all(sessions.map(async (session) => {
      // Determine which user ID to fetch (requester or target)
      const userIdToFetch = session.requesterId === currentUserId
        ? session.targetUserId
        : session.requesterId;

      // Fetch user data
      const userData = await getUserDoc(userIdToFetch);
      if (userData) {
        sessionMap[userIdToFetch] = userData as User;
      }
    }));

    return sessionMap;
  };

  // Set up listener for pending sessions
  onSnapshot(pendingQuery, async (snapshot) => {
    const sessions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Session));

    console.log("ACCEPTED LISTENER", sessions, FIREBASE_AUTH.currentUser?.email)

    // Check for rejection updates and remove rejected sessions
    snapshot.docChanges().forEach(change => {
        const status = change.doc.data().status;
        if (status === 'reject_pending') {
            dispatch(removePendingSession(change.doc.id));
        }
    });

    // Map with user data
    const pendingMap = await mapSessionsWithUserData(sessions);
    dispatch(setPendingSessions({ sessions, pendingMap }));
  });

  // Set up listeners for accepted sessions
  onSnapshot(acceptedTargetQuery, async (snapshot) => {
    const targetSessions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Session));

    onSnapshot(acceptedRequesterQuery, async (reqSnapshot) => {
      const requesterSessions = reqSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    } as Session));

    const combinedAcceptedSessions = [...targetSessions, ...requesterSessions];
    console.log("ACCEPTED LISTENER", combinedAcceptedSessions, FIREBASE_AUTH.currentUser?.email)

    // Check for rejection updates and remove rejected sessions
    snapshot.docChanges().forEach(change => {
        const status = change.doc.data().status;
        if (status === 'reject_accepted') {
            dispatch(removeAcceptedSession(change.doc.id));
        }
    });

      // Map with user data
    const acceptedMap = await mapSessionsWithUserData(combinedAcceptedSessions);
    dispatch(setAcceptedSessions({ sessions: combinedAcceptedSessions, acceptedMap }));
    });
  });

  // Set up listeners for booked sessions
  onSnapshot(bookedTargetQuery, async (snapshot) => {
    const targetSessions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Session));

    onSnapshot(bookedRequesterQuery, async (reqSnapshot) => {
      const requesterSessions = reqSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Session));

      const combinedBookedSessions = [...targetSessions, ...requesterSessions];

      // Map with user data
      const bookedMap = await mapSessionsWithUserData(combinedBookedSessions);
      dispatch(setBookedSessions({ sessions: combinedBookedSessions, bookedMap }));
    });
  });
};