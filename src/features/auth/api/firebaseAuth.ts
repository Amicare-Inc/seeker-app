import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  UserCredential,
} from 'firebase/auth';
import { FIREBASE_AUTH } from '@/firebase.config';


/* ALL DEPRICATED */

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
 * Signs up a user with email and password.
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
 * Sends email verification to the user.
 * @param user - The user to send verification to.
 */
export const verifyEmail = async (user: any) => {
  try {
    await sendEmailVerification(user);
  } catch (error) {
    throw new Error(`Email verification failed: ${(error as any).message}`);
  }
}; 