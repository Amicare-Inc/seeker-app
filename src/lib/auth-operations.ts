import {
  updatePassword,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { FIREBASE_AUTH } from '@/firebase.config';

export const requestPasswordReset = async (email: string): Promise<void> => {
  const trimmed = email.trim();
  if (!trimmed) {
    throw new Error('Please enter your email address.');
  }

  try {
    await sendPasswordResetEmail(FIREBASE_AUTH, trimmed);
  } catch (error: any) {
    console.error('Password reset request failed:', error);
    if (error.code === 'auth/invalid-email') {
      throw new Error('Please enter a valid email address.');
    }
    if (error.code === 'auth/user-not-found') {
      return;
    }
    if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many attempts. Please try again later.');
    }
    if (error.code === 'auth/network-request-failed') {
      throw new Error('Network error. Check your connection and try again.');
    }
    throw new Error(error.message || 'Could not send reset email. Please try again.');
  }
};

export const changeUserPassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  const user = FIREBASE_AUTH.currentUser;
  
  if (!user || !user.email) {
    throw new Error('No authenticated user found');
  }

  try {
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
    
    console.log('Password updated successfully');
  } catch (error: any) {
    console.error('Error changing password:', error);
    
    if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      throw new Error('Current password is incorrect. Please try again.');
    } else if (error.code === 'auth/weak-password') {
      throw new Error(
        'That password is too weak or too common. Use at least 6 characters (8+ recommended) with a mix of letters, numbers, and symbols. Avoid obvious words like "password" or simple sequences like "123456".',
      );
    } else if (error.code === 'auth/requires-recent-login') {
      throw new Error('For security reasons, please sign out and sign back in before changing your password');
    } else if (error.code === 'auth/user-mismatch') {
      throw new Error('Authentication error. Please sign out and sign back in.');
    } else if (error.code === 'auth/user-not-found') {
      throw new Error('User account not found. Please sign in again.');
    } else {
      throw new Error(error.message || 'Failed to update password');
    }
  }
};

/**
 * Deletes the user's account using Firebase Client SDK with proper re-authentication
 */
export const deleteUserAccount = async (password: string, isPsW: boolean): Promise<void> => {
  const user = FIREBASE_AUTH.currentUser;
  
  if (!user || !user.email) {
    throw new Error('No authenticated user found');
  }

  try {
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);

    console.log('Deleting user data from backend...');
    try {
      const user = FIREBASE_AUTH.currentUser;
      if (!user) {
        throw new Error('User not authenticated - cannot get token');
      }
      
      console.log('Getting fresh auth token...');
      const token = await user.getIdToken(true);
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      console.log('Making DELETE request to backend...');
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/auth/users/${user.uid}/data`, {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ isPsW }),
      });

      console.log('Backend response status:', response.status);
      console.log('Backend response headers:', response.headers);

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorText;
        
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorText = errorData.message || errorData.error || 'Unknown error';
        } else {
          errorText = await response.text();
        }
        
        console.error('Backend deletion failed:', errorText);
        throw new Error(`Backend deletion failed (${response.status}): ${errorText}`);
      }
      console.log('User data deleted from backend successfully');
    } catch (backendError: any) {
      console.error('Backend cleanup failed:', backendError);
      throw new Error(`Failed to delete user data: ${backendError.message}`);
    }

    console.log('Deleting Firebase Auth user...');
    await deleteUser(user);
    
    console.log('Account deleted successfully');
  } catch (error: any) {
    console.error('Error deleting account:', error);
    
    if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      throw new Error('Password is incorrect');
    } else if (error.code === 'auth/requires-recent-login') {
      throw new Error('For security reasons, please sign out and sign back in before deleting your account');
    } else {
      throw new Error(error.message || 'Failed to delete account');
    }
  }
}; 