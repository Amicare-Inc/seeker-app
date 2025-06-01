// @/services/node-express-backend/user.ts
import { User } from '@/types/User';

// const API_BASE_URL = 'http://localhost:3000'; // For local testing
const API_BASE_URL = 'http://192.168.1.6:3000'; // Local network testing
// const API_BASE_URL = 'https://backend-903865090190.us-east5.run.app'; // GCP deployment

export interface UpdateUserProfileResponse {
  user?: User;
  message?: string;
}

export const updateUserProfile = async (userId: string, updatedFields: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/update-profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: userId,
        ...updatedFields,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data: UpdateUserProfileResponse = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};