import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMessages } from '@/features/sessions/api/sessionApi';
import { Message } from '@/types/Message';
import { sessionKeys } from '@/features/sessions/api/queries';

export const useMessages = (sessionId: string | undefined) => {
  const enabled = !!sessionId;
  return useQuery<Message[]>({
    queryKey: sessionKeys.messagesBySession(sessionId || ''),
    queryFn: () => getMessages(sessionId as string),
    enabled,
    refetchOnWindowFocus: false,
  });
}; 