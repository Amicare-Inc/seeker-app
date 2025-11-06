import { useQuery } from '@tanstack/react-query';

// Mock data for testing
const MOCK_APPLICATIONS = [
  {
    userId: 'mock-1',
    pswId: 'mock-1',
    firstName: 'Peter',
    lastName: 'Johnson',
    photoUrl: null,
    specialties: ['Housework', 'Personal Care'],
    distance: 'Mississauga, ON',
    hourlyRate: 35,
  },
  {
    userId: 'mock-2',
    pswId: 'mock-2',
    firstName: 'Jackie',
    lastName: 'Anderson',
    photoUrl: null,
    specialties: ['Personal Care'],
    distance: 'Toronto, ON',
    hourlyRate: 32,
  },
  {
    userId: 'mock-3',
    pswId: 'mock-3',
    firstName: 'Brianne',
    lastName: 'Smith',
    photoUrl: null,
    specialties: ['Housework', 'Personal Care'],
    distance: 'Brampton, ON',
    hourlyRate: 38,
  },
];

export const useSessionApplications = (sessionId: string) => {
  return useQuery({
    queryKey: ['session-applications', sessionId],
    queryFn: async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/sessions/${sessionId}/candidates`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch session applications');
        }

        const data = await response.json();
        console.log('[BACKEND] Retrieved session applications for session:', sessionId, data);
        return data;
      } catch (error) {
        console.error('Error fetching session applications:', error);
        // Fall back to mock data if backend fails
        console.log('[FALLBACK] Using mock applications for session:', sessionId);
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_APPLICATIONS;
      }
    },
    enabled: !!sessionId,
  });
};
