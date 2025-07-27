import { useEffect } from 'react';
import { joinSessionRoom, leaveSessionRoom, getSocket } from '@/src/features/socket';

/**
 * Joins a socket.io room for the given session and cleans up on unmount.
 * Safe-guards when socket isn't connected or sessionId is falsy.
 */
export const useSocketRoom = (sessionId?: string | null) => {
  useEffect(() => {
    if (!sessionId) return;

    const socket = getSocket();

    if (!socket) {
      if (__DEV__) {
        console.warn('[useSocketRoom] socket not connected');
      }
      return;
    }

    // Use the new room management functions
    joinSessionRoom(sessionId);

    return () => {
      leaveSessionRoom(sessionId);
    };
  }, [sessionId]);
}; 