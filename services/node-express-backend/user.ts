// @/services/node-express-backend/user.ts
import { User } from '@/types/User';

// const API_BASE_URL = 'http://localhost:3000'; // For local testing
const API_BASE_URL = 'http://192.168.1.6:3000'; // Local network testing
// const API_BASE_URL = 'https://backend-903865090190.us-east5.run.app'; // GCP deployment

export interface UpdateUserProfileResponse {
  user?: User;
  message?: string;
}

export const updateUserProfile = async (
  userId: string,
  updatedFields: any
): Promise<UpdateUserProfileResponse> => {
  const response = await fetch('http://192.168.1.6:3000/users/update-profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      uid: userId,
      ...updatedFields,
    }),
  });

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await response.text();
    console.error('Expected JSON, got:', text);
    throw new Error('Server returned non-JSON data');
  }

  const data: UpdateUserProfileResponse = await response.json();
  return data;
};