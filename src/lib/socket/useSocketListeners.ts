import { useEffect } from 'react';
import { connectSocket, getSocket, isSocketConnected } from '@/src/features/socket';
import { useQueryClient } from '@tanstack/react-query';
import { EnrichedSession } from '@/types/EnrichedSession';
import { Message } from '@/types/Message';
import { SocketPayloads } from '@/shared/constants/socketEvents';
import { logger } from '@/lib/logger';
import { sessionKeys } from '@/features/sessions/api/queries';
import { router } from 'expo-router';
import { useActiveSession } from '@/lib/context/ActiveSessionContext';
// Removed SessionCompletionContext import

const socketLogger = logger.child('[Socket]');

export const useSocketListeners = (userId?: string) => {
  const queryClient = useQueryClient();
  const { setActiveEnrichedSession } = useActiveSession();
  // Removed SessionCompletionContext usage

  // lazily ensure connection with enhanced reliability
  const socket = getSocket();
  useEffect(() => {
    if (!socket && userId) {
      socketLogger.info('Initializing socket connection', { userId });
      connectSocket(userId);
    }
  }, [socket, userId]);

  // Monitor connection health and attempt reconnection if needed - enhanced for iOS
  useEffect(() => {
    if (!userId) return;

    const healthCheck = setInterval(() => {
      const connected = isSocketConnected();
      if (!connected) {
        socketLogger.warn('Socket health check failed - attempting reconnection', { userId });
        connectSocket(userId);
      }
    }, 10000); // Reduced from 15000 to 10000 for better iOS reliability

    return () => clearInterval(healthCheck);
  }, [userId]);

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
        // Removed setCompletedSession call
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

    const handleSessionForceRefresh = () => {
      socketLogger.info('Force refresh sessions triggered');
      // Immediately invalidate all session queries to force refetch
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
      // Also refetch any active session data
      queryClient.refetchQueries({ queryKey: sessionKeys.lists() });
    };

    // ✅ CRITICAL: Add handlers for direct socket events (backup for Firebase listener failures)
    const handleChecklistUpdated = (data: SocketPayloads['checklist:updated']) => {
      socketLogger.info('Direct checklist update received', { sessionId: data.sessionId, updatedBy: data.updatedBy });
      
      // Update React Query cache immediately for all session lists
      const allSessionsQueries = queryClient.getQueryCache().findAll({ queryKey: sessionKeys.lists() });
      allSessionsQueries.forEach(query => {
        if (query.state.data) {
          const sessions = query.state.data as EnrichedSession[];
          const updatedSessions = sessions.map(session => {
            if (session.id === data.sessionId) {
              return {
                ...session,
                checklist: data.checklist
              };
            }
            return session;
          });
          queryClient.setQueryData(query.queryKey, updatedSessions);
        }
      });
      
      // Also invalidate to trigger refetch as backup
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
    };

    const handleCommentAdded = (data: SocketPayloads['comment:added']) => {
      socketLogger.info('Direct comment addition received', { sessionId: data.sessionId, addedBy: data.addedBy });
      
      // Update React Query cache immediately for all session lists
      const allSessionsQueries = queryClient.getQueryCache().findAll({ queryKey: sessionKeys.lists() });
      allSessionsQueries.forEach(query => {
        if (query.state.data) {
          const sessions = query.state.data as EnrichedSession[];
          const updatedSessions = sessions.map(session => {
            if (session.id === data.sessionId) {
              return {
                ...session,
                comments: [...(session.comments || []), data.comment]
              };
            }
            return session;
          });
          queryClient.setQueryData(query.queryKey, updatedSessions);
        }
      });
      
      // Also invalidate to trigger refetch as backup
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
    };

    /* --------------------------- SUBSCRIPTIONS ----------------------------- */
    socket.on('session:update', handleSessionUpdate);
    socket.on('chat:newMessage', handleChatNewMessage);
    socket.on('session:started', handleSessionStarted);
    socket.on('session:completed', handleSessionCompleted);
    socket.on('session:booked', handleSessionBooked);
    socket.on('session:forceRefresh', handleSessionForceRefresh);
    // ✅ Add direct socket event subscriptions for production reliability
    socket.on('checklist:updated', handleChecklistUpdated);
    socket.on('comment:added', handleCommentAdded);

    // ✅ Enhanced connection event logging
    socket.on('connect', () => {
      socketLogger.info('Socket reconnected in listeners');
    });

    socket.on('disconnect', (reason) => {
      socketLogger.warn('Socket disconnected in listeners', { reason });
    });

    return () => {
      socket.off('session:update', handleSessionUpdate);
      socket.off('chat:newMessage', handleChatNewMessage);
      socket.off('session:started', handleSessionStarted);
      socket.off('session:completed', handleSessionCompleted);
      socket.off('session:booked', handleSessionBooked);
      socket.off('session:forceRefresh', handleSessionForceRefresh);
      // ✅ Clean up direct socket event listeners
      socket.off('checklist:updated', handleChecklistUpdated);
      socket.off('comment:added', handleCommentAdded);
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [socket, queryClient, userId, setActiveEnrichedSession]);
}; 