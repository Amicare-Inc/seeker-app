import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { FIREBASE_AUTH } from '@/firebase.config';

/**
 * Signs in a user with email and password.
 * @param email - The user's email.
 * @param password - The user's password.
 * @returns A promise resolving to the user's credentials.
 */
export const signInWithEmail = async (email: string, password: string) => {
    try {
        return await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
    } catch (error) {
        throw new Error(`Sign in failed: ${(error as any).message}`);
    }
};

/**
 * Signs up a new user with email and password.
 * @param email - The user's email.
 * @param password - The user's password.
 * @returns A promise resolving to the user's credentials.
 */
export const signUpWithEmail = async (email: string, password: string) => {
    try {
        return await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
    } catch (error) {
        throw new Error(`Sign up failed: ${(error as any).message}`);
    }
};

/**
 * Sends a verification email to the current user.
 * @returns A promise resolving when the email has been sent.
 */
export const verifyEmail = async (user: UserCredential["user"]) => {
    if (!user) {
        throw new Error("No user is currently signed in.");
    }
    try {
        await sendEmailVerification(user);
    } catch (error) {
        throw new Error(`Failed to send verification email: ${(error as any).message}`);
    }
};
