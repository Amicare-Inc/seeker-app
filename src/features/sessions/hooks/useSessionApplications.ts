import { useQuery } from '@tanstack/react-query';


export const useSessionApplications = (sessionId: string) => {
  return useQuery({
    queryKey: ['session-applications', sessionId],
    queryFn: async () => {
      try {
        console.log('fetching session applications for session:', sessionId);
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/sessions/${sessionId}/candidates`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        console.log('response', response);

        // If there are no candidates, backend may return 404 or an empty list.
        if (response.status === 404) {
          throw new Error('No candidates found');
        }
        if (!response.ok) {
          const msg = await response.text().catch(() => '');
          throw new Error(msg || 'Failed to fetch session applications');
        }

        const data = await response.json();
        console.log('[BACKEND] Retrieved session applications for session:', sessionId, data);
        return Array.isArray(data) ? data : [];
      } catch (error) {
       
        // Gracefully fall back to empty list if backend fails or there are no candidates
        return [];
      }
    },
    enabled: !!sessionId,
  });
};
