import { SessionDTO } from '@/types/dtos/SessionDto';
import { EnrichedSession } from '@/types/EnrichedSession';
import { Message } from '@/types/Message';
import { Session } from '@/types/Sessions';
// import { API_BASE_URL } from '@/config';
const API_BASE_URL = 'https://f964-184-147-249-113.ngrok-free.app'
// const API_BASE_URL = 'http://localhost:3000'
// const API_BASE_URL = 'http://172.20.10.3:3000'

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

export const requestSession = async (session: SessionDTO): Promise<void> => {

	try {
		const response = await fetch(`${API_BASE_URL}/sessions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				// Add any necessary authentication headers here (e.g., 'Authorization': `Bearer ${token}`)
			},
			body: JSON.stringify(session)
		})

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
		}
    } catch (error: any) {
		console.error('Error requesting session:', error);
		throw error;
    }

}

export const updateSession = async (sessionId: string, session: Partial<Session>): Promise<string> => {
  try {
	const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
	  method: 'PATCH',
	  headers: {
		'Content-Type': 'application/json',
	  },
	  body: JSON.stringify(session),
	});
	if (!response.ok) {
	  const errorData = await response.text
	  throw new Error(errorData.toString() || `HTTP error! status: ${response.status}`);
	}
	const successString = await response.text();
	return successString;
  } catch (error: any) {
	console.error(`Error updating session ${sessionId}:`, error);
	throw error;
  }
}

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
      headers: {
        'Content-Type': 'application/json',
      },
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

export const bookSession = async (sessionId: string, currentUserId: string): Promise<Session> => {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/book`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: currentUserId }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const updatedSession: Session = await response.json();
    return updatedSession;
  } catch (error: any) {
    console.error(`Error booking session ${sessionId}:`, error);
    throw error;
  }
};

export const declineSession = async (sessionId: string): Promise<Session> => {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/decline`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const updatedSession: Session = await response.json();
    return updatedSession;
  } catch (error: any) {
    console.error(`Error declining session ${sessionId}:`, error);
    throw error;
  }
};

export const cancelSession = async (sessionId: string): Promise<Session> => {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/cancel`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const updatedSession: Session = await response.json();
    return updatedSession;
  } catch (error: any) {
    console.error(`Error cancelling session ${sessionId}:`, error);
    throw error;
  }
};

export const sendMessage = async (sessionId: string, userId: string, message: string): Promise<Message> => {

  try {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, message }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
	const newMessage: Message = await response.json();
	return newMessage
  } catch (error: any) {
    console.error(`Error sending message in session ${sessionId}:`, error);
    throw error;
  }

}

export const getMessages = async (sessionId: string): Promise<Message[]> => {
  try {
	const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/messages`, {
	  method: 'GET',
	  headers: {
		'Content-Type': 'application/json',
	  },
	});
	if (!response.ok) {
	  const errorData = await response.json();
	  throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
	}
	const messages: Message[] = await response.json();
	return messages
  } catch (error: any) {
	console.error(`Error getting messages in session ${sessionId}:`, error);
	throw error;
  }
}