import { getDoc, doc, setDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '@/firebase.config';

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