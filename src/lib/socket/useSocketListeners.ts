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
import type { Socket } from 'socket.io-client';

const socketLogger = logger.child('[Socket]');

export const useSocketListeners = (userId?: string) => {
  const queryClient = useQueryClient();
  const { setActiveEnrichedSession } = useActiveSession();

  useEffect(() => {
    if (!userId) return;

    const healthCheck = setInterval(() => {
      const connected = isSocketConnected();
      if (!connected) {
        socketLogger.warn('Socket health check failed - attempting reconnection', { userId });
        void connectSocket(userId);
      }
    }, 10000);

    return () => clearInterval(healthCheck);
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;
    let detach: (() => void) | undefined;

    const run = async () => {
      try {
        await connectSocket(userId);
      } catch (e) {
        socketLogger.error('connectSocket failed', { userId, e });
        return;
      }
      if (cancelled) return;

      const sock = getSocket();
      if (!sock || cancelled) {
        socketLogger.warn('No socket instance after connectSocket');
        return;
      }

      const handleSessionUpdate = (payload: SocketPayloads['session:update']) => {
        socketLogger.debug('session:update', { count: payload.length });
        queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
      };

      const handleChatNewMessage = (messages: SocketPayloads['chat:newMessage']) => {
        if (messages.length) {
          const sessionId = messages[0].sessionId;
          queryClient.setQueryData<Message[]>(
            sessionKeys.messagesBySession(sessionId),
            (oldMessages) => {
              if (!oldMessages) return messages;

              const existingMessagesMap = new Map(oldMessages.map((msg) => [msg.id, msg]));
              const updatedMessages = [...oldMessages];
              messages.forEach((newMessage) => {
                if (!existingMessagesMap.has(newMessage.id)) {
                  updatedMessages.push(newMessage);
                }
              });

              return updatedMessages.sort(
                (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
              );
            }
          );
          queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
        }
      };

      const handleChatNotify = (_payload: SocketPayloads['chat:notify']) => {
        queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
      };

      const handleChatReadReceipt = (payload: SocketPayloads['chat:readReceipt']) => {
        try {
          if (!payload?.sessionId || !payload?.userId || !payload?.lastReadAt) return;
          const me = userId;
          if (payload.userId === me) {
            queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
          }
        } catch {}
      };

      const handleSessionStarted = (data: SocketPayloads['session:started']) => {
        socketLogger.info('Session started', { sessionId: data.sessionId });
        queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
      };

      const handleSessionCompleted = (data: SocketPayloads['session:completed']) => {
        socketLogger.info('Session completed event received', { sessionId: data.sessionId });

        const allSessionsQueries = queryClient.getQueryCache().findAll({ queryKey: sessionKeys.lists() });
        allSessionsQueries.forEach((query) => {
          if (query.state.data) {
            const sessions = query.state.data as EnrichedSession[];
            const updatedSessions = sessions.map((session) => {
              if (session.id === data.sessionId) {
                return {
                  ...session,
                  status: 'completed' as const,
                  actualEndTime: data.actualEndTime,
                  liveStatus: 'completed',
                };
              }
              return session;
            });
            queryClient.setQueryData(query.queryKey, updatedSessions);
          }
        });

        queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });

        if (userId) {
          const listKey = sessionKeys.list(userId);
          const existingList = queryClient.getQueryData<EnrichedSession[]>(listKey) || [];
          const updatedList = existingList.map((s) =>
            s.id === data.sessionId
              ? { ...s, status: 'completed' as const, actualEndTime: data.actualEndTime, liveStatus: 'completed' }
              : s
          );
          queryClient.setQueryData(listKey, updatedList);
        }

        let completedSession: EnrichedSession | undefined;
        const listKeyCheck = userId ? sessionKeys.list(userId) : undefined;
        if (listKeyCheck) {
          completedSession = (queryClient.getQueryData<EnrichedSession[]>(listKeyCheck) || []).find(
            (s) => s.id === data.sessionId
          );
        }
        if (completedSession) {
          setActiveEnrichedSession(completedSession);
        }

        try {
          router.push({
            pathname: '/(chat)/session-completed',
            params: { sessionId: data.sessionId },
          });
        } catch (error) {
          console.error(`Navigation failed for session ${data.sessionId}:`, error);
        }
      };

      const handleSessionBooked = (data: SocketPayloads['session:booked']) => {
        socketLogger.info('Session booked', { sessionId: data.sessionId, status: data.status, bookedBy: data.bookedBy });
        queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
      };

      const handleSessionApplied = (data: SocketPayloads['session:applied']) => {
        socketLogger.info('Session applied', { sessionId: data.sessionId, applicantId: data.applicantId });
        queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
        queryClient.invalidateQueries({ queryKey: sessionKeys.newRequests() });
        queryClient.refetchQueries({ queryKey: sessionKeys.lists() });
        queryClient.refetchQueries({ queryKey: sessionKeys.newRequests() });
      };

      const handleSessionForceRefresh = () => {
        socketLogger.info('Force refresh sessions triggered');
        queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
        queryClient.invalidateQueries({ queryKey: sessionKeys.newRequests() });
        queryClient.refetchQueries({ queryKey: sessionKeys.lists() });
        queryClient.refetchQueries({ queryKey: sessionKeys.newRequests() });
      };

      const handleChecklistUpdated = (data: SocketPayloads['checklist:updated']) => {
        socketLogger.info('Direct checklist update received', { sessionId: data.sessionId, updatedBy: data.updatedBy });
        const allSessionsQueries = queryClient.getQueryCache().findAll({ queryKey: sessionKeys.lists() });
        allSessionsQueries.forEach((query) => {
          if (query.state.data) {
            const sessions = query.state.data as EnrichedSession[];
            const updatedSessions = sessions.map((session) => {
              if (session.id === data.sessionId) {
                return { ...session, checklist: data.checklist };
              }
              return session;
            });
            queryClient.setQueryData(query.queryKey, updatedSessions);
          }
        });
        queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
      };

      const handleCommentAdded = (data: SocketPayloads['comment:added']) => {
        socketLogger.info('Direct comment addition received', { sessionId: data.sessionId, addedBy: data.addedBy });
        const allSessionsQueries = queryClient.getQueryCache().findAll({ queryKey: sessionKeys.lists() });
        allSessionsQueries.forEach((query) => {
          if (query.state.data) {
            const sessions = query.state.data as EnrichedSession[];
            const updatedSessions = sessions.map((session) => {
              if (session.id === data.sessionId) {
                return { ...session, comments: [...(session.comments || []), data.comment] };
              }
              return session;
            });
            queryClient.setQueryData(query.queryKey, updatedSessions);
          }
        });
        queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
      };

      const handleConnect = () => {
        socketLogger.info('Socket connected — refreshing sessions');
        queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
        queryClient.invalidateQueries({ queryKey: sessionKeys.newRequests() });
      };

      const handleDisconnect = (reason: string) => {
        socketLogger.warn('Socket disconnected', { reason });
      };

      sock.on('session:update', handleSessionUpdate);
      sock.on('chat:newMessage', handleChatNewMessage);
      sock.on('chat:notify', handleChatNotify);
      sock.on('chat:readReceipt', handleChatReadReceipt);
      sock.on('session:started', handleSessionStarted);
      sock.on('session:completed', handleSessionCompleted);
      sock.on('session:booked', handleSessionBooked);
      sock.on('session:applied', handleSessionApplied);
      sock.on('session:forceRefresh', handleSessionForceRefresh);
      sock.on('checklist:updated', handleChecklistUpdated);
      sock.on('comment:added', handleCommentAdded);
      sock.on('connect', handleConnect);
      sock.on('disconnect', handleDisconnect);

      if (sock.connected) {
        handleConnect();
      }

      const s: Socket = sock;
      detach = () => {
        s.off('session:update', handleSessionUpdate);
        s.off('chat:newMessage', handleChatNewMessage);
        s.off('chat:notify', handleChatNotify);
        s.off('chat:readReceipt', handleChatReadReceipt);
        s.off('session:started', handleSessionStarted);
        s.off('session:completed', handleSessionCompleted);
        s.off('session:booked', handleSessionBooked);
        s.off('session:applied', handleSessionApplied);
        s.off('session:forceRefresh', handleSessionForceRefresh);
        s.off('checklist:updated', handleChecklistUpdated);
        s.off('comment:added', handleCommentAdded);
        s.off('connect', handleConnect);
        s.off('disconnect', handleDisconnect);
      };
    };

    void run();

    return () => {
      cancelled = true;
      detach?.();
    };
  }, [userId, queryClient, setActiveEnrichedSession]);
};
