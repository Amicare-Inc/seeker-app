import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMessages } from '@/features/sessions/api/sessionApi';
import { Message } from '@/types/Message';

export const useMessages = (sessionId: string | undefined) => {
  const enabled = !!sessionId;
  return useQuery<Message[]>({
    queryKey: ['messages', sessionId],
    queryFn: () => getMessages(sessionId as string),
    enabled,
    refetchOnWindowFocus: false,
  });
}; 