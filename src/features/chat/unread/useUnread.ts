import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useEnrichedSessions, sessionKeys } from '@/features/sessions/api/queries';
import { markMessagesRead } from '@/features/sessions/api/sessionApi';
import { useQueryClient } from '@tanstack/react-query';

// No-op setup retained for compatibility
export function useUnreadSetup() {}

export function useUnreadBadge(sessionId?: string) {
  const userId = useSelector((s: RootState) => s.user.userData?.id);
  const { data: allSessions = [] } = useEnrichedSessions(userId, false);

  if (!sessionId || !userId) return { unread: false };
  const s = allSessions.find((x) => x.id === sessionId);
  
  console.log('sessionId', sessionId);

  if (!s) return { unread: false };
  const lastAt = s.lastMessageAt ? new Date(s.lastMessageAt) : null;
  const lastBy = s.senderId;
  const key = `readReceipts.${userId}`;
  const readAtStr = (s as any)[key];
  const readAt = readAtStr ? new Date(readAtStr) : null;
  const unread = !!(lastAt && lastBy && lastBy !== userId && (!readAt || lastAt > readAt));

  // TEMP debug
  console.log('[UnreadCheck]', {
    sessionId,
    userId,
    lastMessageBy: lastBy,
    lastMessageAt: s.lastMessageAt,
    readAt: readAtStr,
    unread,
  });

  return { unread };
}

export function useUnreadActions() {
  const queryClient = useQueryClient();

  const markRead = async (sessionId: string) => {
    try {
      await markMessagesRead(sessionId);
      // Invalidate sessions to update unread badge
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
    } catch {}
  };
  return { markRead };
}


