import { getAuthHeaders } from '@/lib/auth';

export const updateUserProfile = async (userId: string, updatedFields: any) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/users/update-profile`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        uid: userId,
        ...updatedFields,
        isPsw: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}; 