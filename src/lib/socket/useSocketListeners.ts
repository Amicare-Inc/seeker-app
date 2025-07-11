import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connectSocket, getSocket } from '@/src/features/socket';
import { AppDispatch, RootState } from '@/redux/store';
import { useQueryClient } from '@tanstack/react-query';
import { setSessions } from '@/redux/sessionSlice';
import { setMessages } from '@/redux/chatSlice';
import { EnrichedSession } from '@/types/EnrichedSession';
import { Message } from '@/types/Message';
import { SocketPayloads } from '@/shared/constants/socketEvents';
import { logger } from '@/lib/logger';

const socketLogger = logger.child('[Socket]');

export const useSocketListeners = (userId?: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  // lazily ensure connection
  const socket = getSocket();
  useEffect(() => {
    if (!socket && userId) {
      connectSocket(userId);
    }
  }, [socket, userId]);

  // store latest sessions ref for mutation inside handlers
  const sessions = useSelector((state: RootState) => state.sessions.allSessions);
  const sessionsRef = useRef(sessions);
  useEffect(() => {
    sessionsRef.current = sessions;
  }, [sessions]);

  useEffect(() => {
    if (!socket) return; // wait until connected

    /* ---------------------------- HANDLERS -------------------------------- */
    const handleSessionUpdate = (payload: SocketPayloads['session:update']) => {
      socketLogger.debug('session:update', { count: payload.length });
      dispatch(setSessions(payload));
    };

    const handleChatNewMessage = (messages: SocketPayloads['chat:newMessage']) => {
      dispatch(setMessages(messages));
      if (messages.length) {
        queryClient.setQueryData(['messages', messages[0].sessionId], messages);
      }
    };

    const handleSessionStarted = (data: SocketPayloads['session:started']) => {
      socketLogger.info('Session started', { sessionId: data.sessionId });
      const patched = sessionsRef.current.map((s) =>
        s.id === data.sessionId ? ({ ...s, liveStatus: 'started', actualStartTime: data.actualStartTime } as EnrichedSession) : s,
      );
      dispatch(setSessions(patched));
    };

    const handleSessionCompleted = (data: SocketPayloads['session:completed']) => {
      socketLogger.info('Session completed', { sessionId: data.sessionId });
      const patched = sessionsRef.current.map((s) =>
        s.id === data.sessionId
          ? ({ ...s, liveStatus: 'completed', status: 'completed', actualEndTime: data.actualEndTime } as EnrichedSession)
          : s,
      );
      dispatch(setSessions(patched));
    };

    /* --------------------------- SUBSCRIPTIONS ----------------------------- */
    socket.on('session:update', handleSessionUpdate);
    socket.on('chat:newMessage', handleChatNewMessage);
    socket.on('session:started', handleSessionStarted);
    socket.on('session:completed', handleSessionCompleted);

    return () => {
      socket.off('session:update', handleSessionUpdate);
      socket.off('chat:newMessage', handleChatNewMessage);
      socket.off('session:started', handleSessionStarted);
      socket.off('session:completed', handleSessionCompleted);
    };
  }, [socket, dispatch, queryClient]);
}; 