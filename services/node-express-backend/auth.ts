// frontend/services/backendAuthService.ts

const API_BASE_URL = 'http://localhost:3000'// process.env.EXPO_PUBLIC_API_URL; // Make sure you have this environment variable set up

export const Auth = {
  async signUp(email: string, password: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
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

  async signIn(email: string, password: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // Assuming backend returns a 401 for invalid credentials
        const errorText = await response.text(); // Read as text since 401 might not return JSON
        throw new Error(errorText || 'Sign in failed');
      }

      const data = await response.json(); // Assuming success returns JSON, although controller sends plain text + UID
      return data; // Backend currently returns "Successfully Logged In: [uid]"
    } catch (error: any) {
      console.error('Backend Sign In Error:', error);
      throw new Error(`Backend sign in failed: ${error.message}`);
    }
  },
};