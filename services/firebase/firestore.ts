import { getDoc, doc, setDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebase.config';
import { User } from '@/types/User';

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
 * Fetches all PSW users from Firestore.
 * @returns A promise resolving to an array of PSW users.
 */
export const getListOfUsers = async (isPSW: boolean) => {
    try {
        const q = query(
            collection(FIREBASE_DB, 'personal'),
            where('isPSW', '==', isPSW)
        );
        const querySnapshot = await getDocs(q);
        const users: User[] = querySnapshot.docs.map(doc => {
            const data = doc.data() as User
            return {
            ...data,
            id: doc.id
            };
        });
        return users;
    } catch (error) {
        throw new Error(`Error fetching users: ${(error as any).message}`);
    }
};

/**
 * Creates a booking session in the Firestore database.
 * @param userId - The ID of the user being booked.
 * @returns A promise that resolves when the session is successfully created.
 */
export const createBookingSession = async (userId: string) => {
    try {
      const sessionId = `${FIREBASE_AUTH.currentUser?.uid}_${userId}`; // Create a unique session ID
  
      await setDoc(doc(collection(FIREBASE_DB, "sessions"), sessionId), {
        requesterId: FIREBASE_AUTH.currentUser?.uid, // The ID of the user making the booking request
        targetUserId: userId, // The ID of the user being booked
        status: "pending", // Initial status
        createdAt: new Date(), // Timestamp of the request
      });
  
      return sessionId; // Return session ID if needed for further processing
    } catch (error) {
      throw new Error(`Failed to create booking session: ${(error as any).message}`);
    }
  };