// frontend/services/node-express-backend/session.ts

import { EnrichedSession } from '@/types/EnrichedSession';
import { Session } from '@/types/Sessions';
// import { API_BASE_URL } from '@/config';
// const API_BASE_URL = 'https://0919-2605-8d80-6c1-c8bf-7002-70be-a14b-3ddd.ngrok-free.app'
// const API_BASE_URL = 'http://localhost:3000'
const API_BASE_URL = 'http://172.20.10.3:3000'

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

export const acceptSession = async (sessionId: string): Promise<Session> => {
  console.log('acceptSession called with:', sessionId);
  try {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/accept`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        // Add any necessary authentication headers here (e.g., 'Authorization': `Bearer ${token}`)
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    const updatedSession: Session = await response.json();
    return updatedSession;
  } catch (error: any) {
    console.error(`Error accepting session ${sessionId}:`, error);
    throw error;
  }
};

export const rejectSession = async (sessionId: string): Promise<Session> => {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/reject`, {
      method: 'PATCH',
      // Add headers and potential body similar to acceptSession if needed
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const updatedSession: Session = await response.json();
    return updatedSession;
  } catch (error: any) {
    console.error(`Error rejecting session ${sessionId}:`, error);
    throw error;
  }
};