
const API_BASE_URL = 'https://f964-184-147-249-113.ngrok-free.app'
// const API_BASE_URL = 'http://localhost:3000'// process.env.EXPO_PUBLIC_API_URL; // Make sure you have this environment variable set up
// const API_BASE_URL = 'http://172.20.10.3:3000'// process.env.EXPO_PUBLIC_API_URL; // Make sure you have this environment variable set up

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
  async addCriticalInfo(uid: string, criticalInfoData: any): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup/${uid}/critical-info`, {
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
      const response = await fetch(`${API_BASE_URL}/auth/signup/${uid}/optional-info`, {
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
        const errorText = await response.text();
        throw new Error(errorText);
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      throw new Error(`Backend sign in failed: ${error.message}`);
    }
  },
};