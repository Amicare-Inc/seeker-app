import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getUserSessionTab, 
  acceptSession, 
  rejectSession,
  updateSession,
  requestSession,
  applyToSession,
  bookSession,
  declineSession,
  cancelSession,
  getMessages,
  sendMessage,
  getNewRequestsTab
} from '@/features/sessions/api/sessionApi';
import { SessionDTO } from '@/types/dtos/SessionDto';
import { Session } from '@/types/Sessions';
import { Message } from '@/types/Message';

// Query keys
export const sessionKeys = {
  all: ['sessions'] as const,
  lists: () => [...sessionKeys.all, 'list'] as const,
  list: (userId: string) => [...sessionKeys.lists(), userId] as const,
  details: () => [...sessionKeys.all, 'detail'] as const,
  detail: (id: string) => [...sessionKeys.details(), id] as const,
  messages: () => [...sessionKeys.all, 'messages'] as const,
  messagesBySession: (sessionId: string) => [...sessionKeys.messages(), sessionId] as const,
  newRequests: () => [...sessionKeys.all, 'newRequests'] as const,
};

// Fetch enriched sessions
export function useEnrichedSessions(userId: string | undefined) {
  return useQuery({
    queryKey: sessionKeys.list(userId || ''),
    queryFn: () => getUserSessionTab(userId!),
    enabled: !!userId,
  });
}
//fetch new requested sessions

export function useNewRequestSession(userId: string | undefined) {
  return useQuery({
    queryKey: sessionKeys.newRequests(),
    queryFn: () => getNewRequestsTab(),
    enabled: !!userId,
  });
}

// Fetch messages for a session
export function useMessages(sessionId: string | undefined) {
  return useQuery({
    queryKey: sessionKeys.messagesBySession(sessionId || ''),
    queryFn: () => getMessages(sessionId!),
    enabled: !!sessionId,
  });
}

// Send message mutation
export function useSendMessage() {
  return useMutation({
    mutationFn: ({ sessionId, userId, message }: { sessionId: string; userId: string; message: string }) => 
      sendMessage(sessionId, userId, message),
    // No optimistic updates - let socket handle real-time updates for clean UX
    onError: (error) => {
      console.error('Failed to send message:', error);
      // Could show a toast or error message to user here
    },
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

// Book session mutation
export function useBookSession() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ sessionId, currentUserId }: { sessionId: string; currentUserId: string }) => 
      bookSession(sessionId, currentUserId),
    onSuccess: () => {
      // Invalidate sessions list to refetch
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
    },
  });
}

// Decline session mutation
export function useDeclineSession() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (sessionId: string) => declineSession(sessionId),
    onSuccess: () => {
      // Invalidate sessions list to refetch
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
    },
  });
}

// Cancel session mutation
export function useCancelSession() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (sessionId: string) => cancelSession(sessionId),
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

export function useApplyToSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({sessionId, data}: {sessionId: string; data: Partial<Session>}) =>
      applyToSession(sessionId, data),
    onSuccess: (_, variables) => {
      // Invalidate sessions list to refetch
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: sessionKeys.detail(variables.sessionId) });
    },
  })

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