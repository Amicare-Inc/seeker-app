import { getAuthHeaders } from '@/lib/auth';

// Auth API service
export const AuthApi = {
  async signUp(email: string, password: string, isPsw?: boolean): Promise<any> {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password,
          ...(isPsw !== undefined && { isPsw })
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Sign up failed');
      }

      const data = await response.json();
      return data; // Backend currently returns the userId
    } catch (error: any) {
      console.error('Backend Sign Up Error:', error);
      throw new Error(`Backend sign up failed: ${error.message}`);
    }
  },

  async addCriticalInfo(uid: string, criticalInfoData: any): Promise<void> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/auth/signup/${uid}/critical-info`, {
        method: 'PATCH',
        headers,
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
      const headers = await getAuthHeaders();
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/auth/signup/${uid}/optional-info`, {
        method: 'PATCH',
        headers,
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

  async updateStripeAccount(uid: string, stripeAccountId: string): Promise<void> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/auth/stripe/${uid}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ stripeAccountId }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update Stripe account');
      }
      console.log('Stripe account ID updated successfully');
    } catch (error: any) {
      console.error('Backend updateStripeAccount Error:', error);
      throw new Error(`Failed to update Stripe account: ${error.message}`);
    }
  },

  async signIn(email: string, password: string): Promise<any> {
    try {
      console.log('AuthApi.signIn: Calling backend signin endpoint');
      
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        let errorMessage = 'Sign-in failed';
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          // If we can't parse the error response, try text
          try {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          } catch (textError) {
            // Use status-based error message
            if (response.status === 404) {
              errorMessage = 'Account not found. Please check your email or sign up.';
            } else if (response.status === 400) {
              errorMessage = 'Invalid email or password format.';
            } else if (response.status === 500) {
              errorMessage = 'Server error. Please try again later.';
            }
          }
        }
        
        console.error('AuthApi.signIn error:', errorMessage);
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('AuthApi.signIn: Backend signin successful');
      return data;
    } catch (error: any) {
      console.error('AuthApi.signIn error:', error);
      
      // Re-throw with a consistent error message
      if (error.message) {
        throw error; // Preserve the original error message
      } else {
        throw new Error('Network error. Please check your connection and try again.');
      }
    }
  },
}; 