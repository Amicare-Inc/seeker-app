import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSocket, connectSocket } from '@/services/node-express-backend/sockets';
import { EnrichedSession } from '@/types/EnrichedSession';
import { setSessions } from '@/redux/sessionSlice';
import { Message } from '@/types/Message';
import { setMessages } from '@/redux/chatSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Central hook that attaches global socket listeners and dispatches events
 * into Redux.  It automatically cleans up when the component unmounts or
 * when the socket reference changes.
 */
export const useSocketListeners = (userId?: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  // Ensure socket connection exists (lazy-connect if needed)
  const socket = getSocket();

  // If no socket yet but we have a userId, attempt to connect once.
  useEffect(() => {
    if (!socket && userId) {
      connectSocket(userId);
    }
    // no cleanup – connectSocket manages its own lifecycle
  }, [socket, userId]);

  // Keep latest sessions in a ref so event handlers have access without re-registering
  const sessions = useSelector((state: RootState) => state.sessions.allSessions);
  const sessionsRef = useRef(sessions);
  useEffect(() => {
    sessionsRef.current = sessions;
  }, [sessions]);

  useEffect(() => {
    // If socket not yet connected, wait for next render when it exists
    if (!socket) return;

    const handleSessionUpdate = (sessions: EnrichedSession[]) => {
      console.log('📡 session:update', sessions.length);
      dispatch(setSessions(sessions));
    };

    const handleNewMessages = (messages: Message[]) => {
      // Update Redux store (if components use it)
      dispatch(setMessages(messages));

      // Also update React-Query cache so components using useMessages re-render
      if (messages.length > 0) {
        const sessionId = messages[0].sessionId;
        queryClient.setQueryData(['messages', sessionId], messages);
      }
    };

    const handleSessionStarted = (data: { sessionId: string; status: string; actualStartTime: string }) => {
      const updated = sessionsRef.current.map((s) =>
        s.id === data.sessionId ? ({ ...s, liveStatus: 'started', actualStartTime: data.actualStartTime } as EnrichedSession) : s,
      );
      dispatch(setSessions(updated));
    };

    const handleSessionCompleted = (data: { sessionId: string; status: string; actualEndTime: string }) => {
      const updated = sessionsRef.current.map((s) =>
        s.id === data.sessionId ? ({ ...s, liveStatus: 'completed', status: 'completed', actualEndTime: data.actualEndTime } as EnrichedSession) : s,
      );
      dispatch(setSessions(updated));
    };

    socket.on('session:update', handleSessionUpdate);
    socket.on('chat:newMessage', handleNewMessages);
    socket.on('session:started', handleSessionStarted);
    socket.on('session:completed', handleSessionCompleted);

    return () => {
      socket.off('session:update', handleSessionUpdate);
      socket.off('chat:newMessage', handleNewMessages);
      socket.off('session:started', handleSessionStarted);
      socket.off('session:completed', handleSessionCompleted);
    };
  }, [socket, dispatch, queryClient]);
}; 