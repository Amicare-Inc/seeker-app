import { getAuthHeaders } from '@/lib/auth';

import type { MapUser } from '@/types/MapUser';

export const fetchExploreUsers = async (userType: 'psw' | 'seeker', currentUserId: string) => {
  try {
    const headers = await getAuthHeaders();
    
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/users/explore-filtered?userType=${userType}&currentUserId=${currentUserId}`,
      {
        method: 'GET',
        headers,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const users = await response.json();
    return users;
  } catch (error: any) {
    console.error('Error fetching explore users:', error);
    throw error;
  }
};
/*
export const fetchExploreUsersWithDistance = async (userType: 'psw' | 'seeker', currentUserId: string) => {
  try {
    const headers = await getAuthHeaders();
    
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/users/explore-with-distance?userType=${userType}&currentUserId=${currentUserId}`,
      {
        method: 'GET',
        headers,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const users = await response.json();
    return users;
  } catch (error: any) {
    console.error('Error fetching explore users with distance:', error);
    throw error;
  }
};
*/

export const fetchExploreUsersWithDistance = async (
  userType: 'psw' | 'seeker',
  currentUserId: string
): Promise<MapUser[]> => {
  const headers = await getAuthHeaders();
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/users/explore-with-distance?userType=${userType}&currentUserId=${currentUserId}`,
    { method: 'GET', headers }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};


export const fetchFilteredUsers = async (selectedDays: string[]) => {
  try {
    const headers = await getAuthHeaders();
    const daysQuery = selectedDays.join(',');
    
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/users/filter-availability?days=${daysQuery}`,
      {
        method: 'GET',
        headers,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const users = await response.json();
    return users;
  } catch (error: any) {
    console.error('Error fetching filtered users:', error);
    throw error;
  }
}; 