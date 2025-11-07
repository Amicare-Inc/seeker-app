import { SessionDTO } from '@/types/dtos/SessionDto';
import { EnrichedSession } from '@/types/EnrichedSession';
import { Message } from '@/types/Message';
import { Session } from '@/types/Sessions';
import { ChecklistItem } from '@/types/Sessions';
import { getAuthHeaders } from '@/lib/auth';

export const getUserSessionTab = async (userId: string): Promise<EnrichedSession[]> => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/sessions/tab?userId=${userId}`, {
      method: 'GET',
      headers,
    });

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

export const getNewRequestsTab= async (): Promise<EnrichedSession[]> => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/sessions/requested-tab`, {
      method: 'GET',
      headers,
    });

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
		const headers = await getAuthHeaders();
		const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/sessions/new-request`, {
			method: 'POST',
			headers,
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
	const headers = await getAuthHeaders();
	const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/sessions/${sessionId}`, {
	  method: 'PATCH',
	  headers,
	  body: JSON.stringify(session),
	});
	if (!response.ok) {
	  const errorData = await response.text();
	  throw new Error(errorData.toString() || `HTTP error! status: ${response.status}`);
	}
	const successString = await response.text();
	return successString;
  } catch (error: any) {
	console.error(`Error updating session ${sessionId}:`, error);
	throw error;
  }
}
export const applyToSession = async (sessionId: string, session: Partial<Session>): Promise<Session> => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/sessions/${sessionId}/applicants`, {
      method: 'POST',
      headers,
      body: JSON.stringify(session)
    });
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData.toString() || `HTTP error! status: ${response.status}`);
    }
    const updatedSession: Session = await response.json();
    return updatedSession;
  } catch (error: any) {
    console.error(`Error applying to session ${sessionId}:`, error);
    throw error;
  }
}
export const acceptSession = async (sessionId: string): Promise<Session> => {
  console.log('acceptSession called with:', sessionId);
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/sessions/${sessionId}/accept`, {
      method: 'PATCH',
      headers,
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
    const headers = await getAuthHeaders();
    const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/sessions/${sessionId}/reject`, {
      method: 'PATCH',
      headers,
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
    const headers = await getAuthHeaders();
    const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/sessions/${sessionId}/book`, {
      method: 'PATCH',
      headers,
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
    const headers = await getAuthHeaders();
    const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/sessions/${sessionId}/decline`, {
      method: 'PATCH',
      headers,
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
    const headers = await getAuthHeaders();
    const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/sessions/${sessionId}/cancel`, {
      method: 'PATCH',
      headers,
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
    const headers = await getAuthHeaders();
    const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/sessions/${sessionId}/messages`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ userId, message }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
	const newMessage: Message = await response.json();
	return newMessage;
  } catch (error: any) {
    console.error(`Error sending message in session ${sessionId}:`, error);
    throw error;
  }
}

export const getMessages = async (sessionId: string): Promise<Message[]> => {
  try {
	const headers = await getAuthHeaders();
	const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/sessions/${sessionId}/messages`, {
	  method: 'GET',
	  headers,
	});
	if (!response.ok) {
	  const errorData = await response.json();
	  throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
	}
	const messages: Message[] = await response.json();
	return messages;
  } catch (error: any) {
	console.error(`Error getting messages in session ${sessionId}:`, error);
	throw error;
  }
}

export const markMessagesRead = async (sessionId: string): Promise<{ sessionId: string; userId: string; lastReadAt: string }> => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/sessions/${sessionId}/messages/read`, {
      method: 'POST',
      headers,
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error: any) {
    console.error(`Error marking messages read for session ${sessionId}:`, error);
    throw error;
  }
}

export const updateSessionChecklist = async (sessionId: string, checklist: ChecklistItem[]): Promise<Session> => {
  try {
    // ✅ Optional: Emit immediate socket event for instant feedback while API call is in flight
    const { getSocket } = await import('@/src/features/socket');
    const socket = getSocket();
    if (socket?.connected) {
      socket.emit('checklist:update', {
        sessionId,
        checklist
      });
    }
    
    const headers = await getAuthHeaders();
    const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/sessions/${sessionId}/checklist`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ checklist }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating session checklist:', error);
    throw error;
  }
};

export const addSessionComment = async (sessionId: string, text: string, userId: string): Promise<Session> => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/sessions/${sessionId}/comments`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ text, userId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding session comment:', error);
    throw error;
  }
};

export const submitSessionFeedback = async (sessionId: string, userId: string, reason: string, additionalInfo?: string): Promise<void> => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/sessions/${sessionId}/report`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ userId, reason, additionalInfo })
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || 'Failed to submit report');
  }
}; 