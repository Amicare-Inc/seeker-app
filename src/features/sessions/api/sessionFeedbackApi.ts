/**
 * Session Feedback API functions - Fixed Version
 */

const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3000';

/**
 * Submit session feedback to the server
 * @param sessionId - ID of the session
 * @param reason - Reason for the feedback
 * @param additionalInfo - Additional comments or information
 * @param userId - User ID (from Redux state)
 * @returns Promise with the response data
 */
export const submitSessionFeedback = async (
  sessionId: string,
  reason: string,
  additionalInfo?: string,
  userId?: string
): Promise<{ success: boolean; id?: string; message?: string; error?: string }> => {
  try {
    console.log('🔄 Submitting session feedback...');
    console.log('API URL:', `${API_BASE_URL}/api/session-feedback`);
    console.log('Session ID:', sessionId);
    console.log('Reason:', reason);
    console.log('User ID:', userId);

    if (!userId) {
      console.error('❌ No user ID provided');
      return {
        success: false,
        error: 'User ID is required. Please ensure you are logged in.'
      };
    }

    const requestBody = {
      sessionId,
      reason,
      additionalInfo,
      userId,
    };

    console.log('Request body:', requestBody);

    const response = await fetch(`${API_BASE_URL}/api/session-feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Server error response:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: `HTTP ${response.status}`, message: errorText };
      }

      return {
        success: false,
        error: errorData.error || errorData.message || `Server error: ${response.status}`
      };
    }

    const result = await response.json();
    console.log('✅ Success response:', result);
    return result;

  } catch (error) {
    console.error('❌ Network/Parse error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred'
    };
  }
};

/**
 * Get all feedbacks for a specific session
 * @param sessionId - ID of the session
 * @returns Promise with the feedback data
 */
export const getSessionFeedbacks = async (sessionId: string): Promise<any[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sessions/${sessionId}/feedbacks`);
    
    if (!response.ok) {
      console.error('Failed to fetch session feedbacks:', response.status);
      return [];
    }

    const data = await response.json();
    return data.success ? data.feedbacks : [];
  } catch (error) {
    console.error('Error fetching session feedbacks:', error);
    return [];
  }
};