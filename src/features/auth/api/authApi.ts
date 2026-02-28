import { getAuthHeaders } from '@/lib/auth';

// Auth API service
export const AuthApi = {
  async signUp(email: string, password: string, isPsW: boolean): Promise<any> {
    try {
      // create user in Firebase Auth client-side
      const { createUserWithEmailAndPassword } = await import('firebase/auth');
      const { FIREBASE_AUTH } = await import('@/firebase.config');
      
      const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();
      
      console.log('Firebase user created:', user.uid);
      
      // Then create user profile in backend with JWT token
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          uid: user.uid,
          email: user.email,
          isPsw: isPsW
        }),
      });

      if (!response.ok) {
        let userMessage = 'Sign up failed.';
        try {
          const errorData = await response.json();
          if (response.status === 409 || (errorData.message && errorData.message.includes('already exists'))) {
            userMessage = 'An account with this email already exists.';
          } else {
            userMessage = errorData.message || userMessage;
          }
        } catch {
          userMessage = 'Sign up failed. Please try again.';
        }
        throw new Error(userMessage);
      }

      const data = await response.json();
      return user.uid; // Return the Firebase UID
    } catch (error: any) {
      console.error('Sign Up Error:', error);
      let userMessage = 'Sign up failed.';
      if (error.code === 'auth/email-already-in-use') {
        userMessage = 'An account with this email already exists.';
      } else if (error.code === 'auth/invalid-email') {
        userMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/weak-password') {
        userMessage = 'Password is too weak. Please use at least 6 characters.';
      } else if (error.message) {
        userMessage = error.message;
      }
      throw new Error(userMessage);
    }
  },

  async addCriticalInfo(uid: string, criticalInfoData: any): Promise<void> {
    try {
      // Don't use auth headers for signup flow
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/auth/signup/${uid}/critical-info`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(criticalInfoData),
      });
      if (!response.ok) {
        // Assuming backend sends plain text error message based on previous review
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to add critical information');
      }
      // Backend currently sends a plain text success message, no need to parse JSON
      console.log('Critical information added successfully:', await response.text());
    } catch (error: any) {
      console.error('Backend addCriticalInfo Error:', error);
      throw new Error(`Failed to add critical information: ${error.message}`);
    }
  },

  async addOptionalInfo(uid: string, optionalInfoData: any): Promise<void> {
    try {
      // Don't use auth headers for signup flow
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/auth/signup/${uid}/optional-info`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(optionalInfoData),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to add optional information');
      }
    } catch (error: any) {
      console.error('Backend addOptionalInfo Error:', error);
      throw new Error(`Failed to add optional information: ${error.message}`);
    }
  },

  async updateStripeAccount(uid: string, stripeAccountId: string, isPsw: boolean): Promise<void> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/auth/users/${uid}/stripe-account`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ stripeAccountId, isPsw: isPsw}),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update Stripe account');
      }
    } catch (error: any) {
      console.error('Backend updateStripeAccount Error:', error);
      throw new Error(`Failed to update Stripe account: ${error.message}`);
    }
  },

  async signIn(email: string, password: string): Promise<any> {
    try {
      console.log('AuthApi.signIn: Calling backend signin endpoint for:', email);
      console.log('Backend URL:', process.env.EXPO_PUBLIC_BACKEND_BASE_URL);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, isPsw: false}),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      console.log('Backend response status:', response.status);
      
      if (!response.ok) {
        let userMessage = 'Sign in failed.';
        try {
          const errorData = await response.json();
          if (response.status === 404 || (errorData.error && errorData.error.toLowerCase().includes('not found'))) {
            userMessage = 'No account found with this email. Please sign up first.';
          } else if (response.status === 401 || (errorData.error && errorData.error.toLowerCase().includes('incorrect password'))) {
            userMessage = 'Incorrect password. Please try again.';
          } else if (errorData.error && errorData.error.toLowerCase().includes('invalid email')) {
            userMessage = 'Please enter a valid email address.';
          } else if (errorData.error && errorData.error.toLowerCase().includes('password')) {
            userMessage = 'Password does not meet requirements.';
          } else {
            userMessage = errorData.error || userMessage;
          }
        } catch {
          if (response.status === 404) {
            userMessage = 'No account found with this email. Please sign up first.';
          } else if (response.status === 401) {
            userMessage = 'Incorrect password. Please try again.';
          } else if (response.status === 400) {
            userMessage = 'Invalid email or password format.';
          } else if (response.status === 500) {
            userMessage = 'Server error. Please try again later.';
          } else {
            userMessage = 'Sign in failed. Please try again.';
          }
        }
        throw new Error(userMessage);
      }
      
      const data = await response.json();
      console.log('✅ AuthApi.signIn: Backend signin successful, returning:', {
        id: data.id,
        email: data.email,
        onboardingComplete: data.onboardingComplete,
        isPsw: data.isPsw
      });
      return data;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error('❌ AuthApi.signIn: Request timed out after 15 seconds');
        throw new Error('Request timed out. Please check your internet connection and try again.');
      }
      console.error('❌ AuthApi.signIn error:', error);
      
      // Re-throw with a consistent error message
      if (error.message) {
        throw error; // Preserve the original error message
      } else {
        throw new Error('Network error. Please check your connection and try again.');
      }
    }
  },

  async getUserProfile(uid: string, token: string): Promise<any> {
    try {
      console.log('AuthApi.getUserProfile: Calling backend to get user profile for:', uid);
      console.log('Backend URL:', process.env.EXPO_PUBLIC_BACKEND_BASE_URL);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/auth/users/${uid}?isPsw=false`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      console.log('Backend response status:', response.status);
      
      if (!response.ok) {
        let userMessage = 'Failed to load user profile.';
        try {
          const errorData = await response.json();
          if (response.status === 404) {
            userMessage = 'User profile not found. Please complete your registration.';
          } else if (response.status === 401) {
            userMessage = 'Authentication failed. Please sign in again.';
          } else if (errorData.error) {
            userMessage = errorData.error;
          }
        } catch {
          if (response.status === 404) {
            userMessage = 'User profile not found. Please complete your registration.';
          } else if (response.status === 401) {
            userMessage = 'Authentication failed. Please sign in again.';
          } else if (response.status === 500) {
            userMessage = 'Server error. Please try again later.';
          }
        }
        throw new Error(userMessage);
      }
      
      const data = await response.json();
      console.log('✅ AuthApi.getUserProfile: User profile loaded successfully:', {
        id: data.id,
        email: data.email,
        onboardingComplete: data.onboardingComplete,
        isPsw: data.isPsw
      });
      return data;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error('❌ AuthApi.getUserProfile: Request timed out after 15 seconds');
        throw new Error('Request timed out. Please check your internet connection and try again.');
      }
      console.error('❌ AuthApi.getUserProfile error:', error);
      
      // Re-throw with a consistent error message
      if (error.message) {
        throw error; // Preserve the original error message
      } else {
        throw new Error('Network error. Please check your connection and try again.');
      }
    }
  },

  async getUser(uid: string, isPsW: boolean): Promise<any> {
    try {
      const headers = await getAuthHeaders();
      const url = `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/auth/users/${uid}?isPsw=false`;
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to fetch user');
      }
      return await response.json();
    } catch (error: any) {
      console.error('Backend getUser Error:', error);
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  },
}; 