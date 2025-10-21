import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useEnrichedSessions } from '@/features/sessions/api/queries';
import { markMessagesRead } from '@/features/sessions/api/sessionApi';

// No-op setup retained for compatibility
export function useUnreadSetup() {}

export function useUnreadBadge(sessionId?: string) {
  const userId = useSelector((s: RootState) => s.user.userData?.id);
  const { data: allSessions = [] } = useEnrichedSessions(userId);

  if (!sessionId || !userId) return { unread: false };
  const s = allSessions.find((x) => x.id === sessionId);
  if (!s) return { unread: false };
  const lastAt = s.lastMessageAt ? new Date(s.lastMessageAt) : null;
  const lastBy = s.lastMessageBy;
  const readAtStr = s.readReceipts?.[userId];
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
  // Only server-side mark read
  const markRead = async (sessionId: string) => {
    try { await markMessagesRead(sessionId); } catch {}
  };
  return { markRead };
}


