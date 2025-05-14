// frontend/services/node-express-backend/session.ts

import { EnrichedSession } from '@/types/EnrichedSession';
// import { API_BASE_URL } from '@/config';
const API_BASE_URL = 'https://f89e-184-147-249-113.ngrok-free.app'

export const getUserSessionTab = async (userId: string): Promise<EnrichedSession[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions/tab?userId=${userId}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const sessions: EnrichedSession[] = await response.json();
    return sessions;
  } catch (error: any) {
    console.error('Error fetching user sessions from backend:', error);
    throw error;
  }
};