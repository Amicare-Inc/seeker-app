import { FIREBASE_AUTH } from '@/firebase.config';

/**
 * Get the current Firebase ID token for API requests
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    const user = FIREBASE_AUTH.currentUser;
    if (!user) {
      console.warn('No authenticated user found');
      return null;
    }
    
    // Get fresh token (handles refresh automatically)
    const token = await user.getIdToken(true);
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Get auth headers for API requests
 */
export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const token = await getAuthToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

/**
 * Check if user is currently authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!FIREBASE_AUTH.currentUser;
}; 