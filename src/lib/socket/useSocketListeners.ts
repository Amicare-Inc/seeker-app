import { useEffect } from 'react';
import { connectSocket, getSocket } from '@/src/features/socket';
import { useQueryClient } from '@tanstack/react-query';
import { EnrichedSession } from '@/types/EnrichedSession';
import { Message } from '@/types/Message';
import { SocketPayloads } from '@/shared/constants/socketEvents';
import { logger } from '@/lib/logger';
import { sessionKeys } from '@/features/sessions/api/queries';
import { router } from 'expo-router';
import { useActiveSession } from '@/lib/context/ActiveSessionContext';

const socketLogger = logger.child('[Socket]');

export const useSocketListeners = (userId?: string) => {
  const queryClient = useQueryClient();
  const { setActiveEnrichedSession } = useActiveSession();

  // lazily ensure connection
  const socket = getSocket();
  useEffect(() => {
    if (!socket && userId) {
      connectSocket(userId);
    }
  }, [socket, userId]);

  useEffect(() => {
    if (!socket) return; // wait until connected

    /* ---------------------------- HANDLERS -------------------------------- */
    const handleSessionUpdate = (payload: SocketPayloads['session:update']) => {
      socketLogger.debug('session:update', { count: payload.length });
      // Update React Query cache for sessions - invalidate all session lists to refetch
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
    };

    const handleChatNewMessage = (messages: SocketPayloads['chat:newMessage']) => {
      // Update React Query cache for messages with deduplication
      if (messages.length) {
        const sessionId = messages[0].sessionId;
        queryClient.setQueryData<Message[]>(
          sessionKeys.messagesBySession(sessionId),
          (oldMessages) => {
            if (!oldMessages) return messages;
            
            // Create a map of existing messages by ID for fast lookup
            const existingMessagesMap = new Map(oldMessages.map(msg => [msg.id, msg]));
            
            // Add new messages, avoiding duplicates
            const updatedMessages = [...oldMessages];
            messages.forEach(newMessage => {
              if (!existingMessagesMap.has(newMessage.id)) {
                updatedMessages.push(newMessage);
              }
            });
            
            // Sort by timestamp to maintain order
            return updatedMessages.sort((a, b) => 
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            );
          }
        );
      }
    };

    const handleSessionStarted = (data: SocketPayloads['session:started']) => {
      socketLogger.info('Session started', { sessionId: data.sessionId });
      // Invalidate session lists to refetch updated session data
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
    };

    const handleSessionCompleted = (data: SocketPayloads['session:completed']) => {
      socketLogger.info('🎉 Session completed event received!', { sessionId: data.sessionId });

      
      // Optimistically update the session status in React Query cache
      const allSessionsQueries = queryClient.getQueryCache().findAll({ queryKey: sessionKeys.lists() });
      allSessionsQueries.forEach(query => {
        if (query.state.data) {
          const sessions = query.state.data as EnrichedSession[];
          const updatedSessions = sessions.map(session => {
            if (session.id === data.sessionId) {

              return {
                ...session,
                status: 'completed' as const,
                actualEndTime: data.actualEndTime,
                liveStatus: 'completed'
              };
            }
            return session;
          });
          
          // Update the cache immediately
          queryClient.setQueryData(query.queryKey, updatedSessions);
        }
      });
      
      // Invalidate session lists to refetch updated session data (backup)
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
      
      // Also update specific user list query to ensure availability
      if (userId) {
        const listKey = sessionKeys.list(userId);
        const existingList = queryClient.getQueryData<EnrichedSession[]>(listKey) || [];
        const updatedList = existingList.map(s =>
          s.id === data.sessionId ? { ...s, status: 'completed' as const, actualEndTime: data.actualEndTime, liveStatus: 'completed' } : s
        );
        queryClient.setQueryData(listKey, updatedList);
      }

      // After optimistic cache update block
      let completedSession: EnrichedSession | undefined;
      const listKeyCheck = userId ? sessionKeys.list(userId) : undefined;
      if (listKeyCheck) {
        completedSession = (queryClient.getQueryData<EnrichedSession[]>(listKeyCheck) || []).find(s => s.id === data.sessionId);
      }
      if (completedSession) {
        setActiveEnrichedSession(completedSession);
      }

      // Navigate directly to session completed page

      try {
        router.push({ 
          pathname: '/(chat)/session-completed', 
          params: { sessionId: data.sessionId } 
        });

      } catch (error) {
        console.error(`❌ Navigation failed for session ${data.sessionId}:`, error);
      }
    };

    const handleSessionBooked = (data: SocketPayloads['session:booked']) => {
      socketLogger.info('Session booked', { sessionId: data.sessionId, status: data.status, bookedBy: data.bookedBy });
      // Invalidate session lists to refetch updated session data
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
    };

    /* --------------------------- SUBSCRIPTIONS ----------------------------- */
    socket.on('session:update', handleSessionUpdate);
    socket.on('chat:newMessage', handleChatNewMessage);
    socket.on('session:started', handleSessionStarted);
    socket.on('session:completed', handleSessionCompleted);
    socket.on('session:booked', handleSessionBooked);

    return () => {
      socket.off('session:update', handleSessionUpdate);
      socket.off('chat:newMessage', handleChatNewMessage);
      socket.off('session:started', handleSessionStarted);
      socket.off('session:completed', handleSessionCompleted);
      socket.off('session:booked', handleSessionBooked);
    };
  }, [socket, queryClient]);
}; 