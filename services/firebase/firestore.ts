import { getDoc, doc, setDoc, query, collection, where, getDocs, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebase.config';
import { User } from '@/types/User';
import { Session } from '@/types/Sessions';

/**
 * Fetches the user document from Firestore based on the user's UID.
 * @param uid - The user's UID.
 * @returns A promise resolving to the user data if it exists, otherwise null.
 */
export const getUserDoc = async (uid: string) => {
    try {
        const userDocRef = doc(FIREBASE_DB, 'personal', uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            return userDoc.data();
        } else {
            console.log('No such document!');
            return null;
        }
    } catch (error) {
        throw new Error(`Failed to get user document: ${(error as any).message}`);
    }
};

/**
 * Sets (creates or updates) the user document in Firestore.
 * @param uid - The user's UID.
 * @param userData - The user data to set in the document.
 * @returns A promise resolving when the document has been written.
 */
export const setUserDoc = async (uid: string, userData: any) => {
    try {
        const userDocRef = doc(FIREBASE_DB, 'personal', uid);
        await setDoc(userDocRef, userData, { merge: true }); // merge: true will merge with existing data
        console.log('User document successfully written!');
    } catch (error) {
        throw new Error(`Failed to set user document: ${(error as any).message}`);
    }
};

/**
 * DEPRECIATED
 * Fetches all PSW users from Firestore.
 * @returns A promise resolving to an array of PSW users.
 */
// export const getListOfUsers = async (isPSW: boolean) => {
//     try {
//         const q = query(
//             collection(FIREBASE_DB, 'personal'),
//             where('isPSW', '==', isPSW),
//         );
//         const querySnapshot = await getDocs(q);
//         const users: User[] = querySnapshot.docs.map(doc => {
//             const data = doc.data() as User
//             return {
//             ...data,
//             id: doc.id
//             };
//         });
//         return users;
//     } catch (error) {
//         throw new Error(`Error fetching users: ${(error as any).message}`);
//     }
// };


/**
 * Retrieves a list of available PSWs, excluding those who are involved in a pending or accepted session with the current user.
 * @returns A promise that resolves to an array of available PSWs.
 */
export const getListOfUsers = async (isPSW: boolean) => {
    const currentUserId = FIREBASE_AUTH.currentUser?.uid;
    // if (!currentUser) throw new Error("User not authenticated");             CHECK AFTER

    // Query 1: Get sessions where currentUserId is the requester
    const requesterQuery = query(
        collection(FIREBASE_DB, "sessions"),
        where("requesterId", "==", currentUserId),
        where("status", "in", ["pending", "accepted", "booked"])
    );

    // Query 2: Get sessions where currentUserId is the target
    const targetQuery = query(
        collection(FIREBASE_DB, "sessions"),
        where("targetUserId", "==", currentUserId),
        where("status", "in", ["pending", "accepted", "booked"])
    );

    // Execute both queries
    const [requesterSnapshot, targetSnapshot] = await Promise.all([
        getDocs(requesterQuery),
        getDocs(targetQuery),
    ]);

    const excludedUserIds = new Set<string>();

    // Process the results of both queries
    requesterSnapshot.forEach(doc => {
        const data = doc.data();
        excludedUserIds.add(data.targetUserId);  // Exclude users that the current user has requested
    });

    targetSnapshot.forEach(doc => {
        const data = doc.data();
        excludedUserIds.add(data.requesterId);  // Exclude users that have requested the current user
    });

    // Query to find all available PSWs
    const listQuery = query(
        collection(FIREBASE_DB, "personal"),
        where("isPSW", "==", isPSW)
    );

    const pswSnapshot = await getDocs(listQuery);
    const availableUser: User[] = [];

    pswSnapshot.forEach(doc => {
        if (!excludedUserIds.has(doc.id)) {
            availableUser.push({ id: doc.id, ...doc.data() } as User);
        }
    });

    return availableUser;
  };

/**
 * Creates a booking session in the Firestore database.
 * @param userId - The ID of the user being booked.
 * @returns A promise that resolves when the session is successfully created.
 */
export const createBookingSession = async (userId: string) => {
    try {
      const status = 'pending'
      const sessionId = `${FIREBASE_AUTH.currentUser?.uid}_${userId}_${status}`; // Create a unique session ID
  
      await setDoc(doc(collection(FIREBASE_DB, "sessions"), sessionId), {
        requesterId: FIREBASE_AUTH.currentUser?.uid, // The ID of the user making the booking request
        targetUserId: userId, // The ID of the user being booked
        status: status, // Initial status
        // createdAt: new Date(), // Timestamp of the request
      });
  
      return sessionId; // Return session ID if needed for further processing
    } catch (error) {
      throw new Error(`Failed to create booking session: ${(error as any).message}`);
    }
};

const convertFirestoreTimestampToDate = (session: any) => {
    return {
      ...session,
      createdAt: session.createdAt?.toString(), // Converts Firestore Timestamp to JS Date
    };
};

/**
 * Fetches sessions where the current user is the target and the status is either pending or accepted.
 * @param status - An array of statuses to filter by. Default is ['pending', 'accepted'].
 * @returns A promise that resolves to an array of sessions.
 */
export const fetchUserSessions = async (status: string, typeUser: string): Promise<Session[]> => {
    const currentUserId = FIREBASE_AUTH.currentUser?.uid;
    // if (!currentUser) throw new Error("User not authenticated");
  
    // const currentUserId = currentUser.uid;
  
    // Construct the Firestore query
    const q = query(
      collection(FIREBASE_DB, 'sessions'),
    //   where(typeUser, '==', currentUserId),
      where(typeUser === "requesterId" ? "requesterId" : "targetUserId", "==", currentUserId),
      where('status', '==', status)
    );
  
    // Execute the query and process the results
    const querySnapshot = await getDocs(q);
    const sessions = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    })) as Session[];

    // const sessions_redux = sessions.map(convertFirestoreTimestampToDate)
    // console.log("sessions redux",sessions_redux)
    // console.log("sessions redux created",sessions_redux[0]["createdAt"])
    // console.log("sessions redux created type",typeof sessions_redux[0]["createdAt"])
    // console.log("sessions redux created after", sessions_redux[0]["createdAt"])
    // return sessions_redux;
    return sessions;
  };

  /**
   * Updates the status of a session.
   * @param sessionId - The ID of the session to update.
   * @param status - The new status to set.
   */
  export const updateSessionStatus = async (sessionId: string, status: string): Promise<void> => {
    try {
      console.log(`Attempting to update session ${sessionId} to status ${status}`);
      await updateDoc(doc(FIREBASE_DB, 'sessions', sessionId), { status });
      console.log(`Session ${sessionId} updated to status ${status}`);
    } catch (error) {
      throw new Error(`Failed to update session status: ${(error as any).message}`);
    }
  };