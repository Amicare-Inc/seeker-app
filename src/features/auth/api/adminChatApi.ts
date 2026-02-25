import { getAuthHeaders } from '@/lib/auth';
import { Message } from '@/types/Message';

const BASE = `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/auth/chat`;

export interface UserInstitution {
  institutionId: string;
  institutionName: string;
  chatId: string | null;
}

export const getUserInstitutions = async (): Promise<UserInstitution[]> => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE}/institutions`, {
      method: 'GET',
      headers,
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error: any) {
    console.error('Error getting user institutions:', error);
    throw error;
  }
};

export const getAdminChatId = async (): Promise<{ id: string; institutionName: string | null } | null> => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE}/chat-id`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Chat doesn't exist yet
      }
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (!result?.id) return null;
    return { id: result.id, institutionName: result.institutionName || null };
  } catch (error: any) {
    console.error('Error getting admin chat ID:', error);
    throw error;
  }
};

export const createAdminChat = async (institutionId?: string): Promise<string> => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE}/chat/create`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: institutionId ? JSON.stringify({ institutionId }) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.id || result.chatId;
  } catch (error: any) {
    console.error('Error creating admin chat:', error);
    throw error;
  }
};

export const sendAdminMessage = async (chatId: string, message: string): Promise<Message> => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE}/chats/${chatId}/messages`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const newMessage: Message = await response.json();
    return newMessage;
  } catch (error: any) {
    console.error(`Error sending admin message in chat ${chatId}:`, error);
    throw error;
  }
};

export const getAdminMessages = async (chatId: string): Promise<Message[]> => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE}/chats/${chatId}/messages`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const messages: Message[] = await response.json();
    return messages;
  } catch (error: any) {
    console.error(`Error getting admin messages in chat ${chatId}:`, error);
    throw error;
  }
};

/** Chat document as returned by GET /auth/chat/chats */
export interface InstitutionChat {
  id: string;
  participants: string[];
  institutionId?: string;
  title?: string | null;
  createdBy?: string;
  createdAt?: string;
}

export const getUserChatsForInstitution = async (institutionId: string): Promise<InstitutionChat[]> => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE}/chats?institutionId=${encodeURIComponent(institutionId)}`, {
      method: 'GET',
      headers,
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    const list = await response.json();
    return Array.isArray(list) ? list : [];
  } catch (error: any) {
    console.error('Error getting user chats for institution:', error);
    throw error;
  }
};

export const createUserChatWithTitle = async (
  institutionId: string,
  title?: string
): Promise<InstitutionChat> => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE}/chats`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ institutionId, title: title ?? undefined }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error: any) {
    console.error('Error creating user chat with title:', error);
    throw error;
  }
};
