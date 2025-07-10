import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getUserSessionTab, 
  acceptSession, 
  rejectSession,
  updateSession,
  requestSession 
} from '@/features/sessions/api/sessionApi';
import { SessionDTO } from '@/types/dtos/SessionDto';
import { Session } from '@/types/Sessions';

// Query keys
export const sessionKeys = {
  all: ['sessions'] as const,
  lists: () => [...sessionKeys.all, 'list'] as const,
  list: (userId: string) => [...sessionKeys.lists(), userId] as const,
  details: () => [...sessionKeys.all, 'detail'] as const,
  detail: (id: string) => [...sessionKeys.details(), id] as const,
};

// Fetch enriched sessions
export function useEnrichedSessions(userId: string | undefined) {
  return useQuery({
    queryKey: sessionKeys.list(userId || ''),
    queryFn: () => getUserSessionTab(userId!),
    enabled: !!userId,
  });
}

// Accept session mutation
export function useAcceptSession() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (sessionId: string) => acceptSession(sessionId),
    onSuccess: () => {
      // Invalidate sessions list to refetch
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
    },
  });
}

// Reject session mutation
export function useRejectSession() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (sessionId: string) => rejectSession(sessionId),
    onSuccess: () => {
      // Invalidate sessions list to refetch
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
    },
  });
}

// Update session mutation
export function useUpdateSession() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ sessionId, data }: { sessionId: string; data: Partial<Session> }) =>
      updateSession(sessionId, data),
    onSuccess: (_, variables) => {
      // Invalidate sessions list to refetch
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: sessionKeys.detail(variables.sessionId) });
    },
  });
}

// Request session mutation
export function useRequestSession() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: SessionDTO) => requestSession(data),
    onSuccess: () => {
      // Invalidate sessions list to refetch
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
    },
  });
} 