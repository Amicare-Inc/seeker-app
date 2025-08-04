import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';
import { EnrichedSession } from '@/types/EnrichedSession';
import { LiveSessionStatus } from '@/types/LiveSession';
import { RootState } from '@/redux/store';
import { useEnrichedSessions } from '@/features/sessions/api/queries';
import { useSessionCompletion } from '@/lib/context/SessionCompletionContext';
import { mapFirebaseStatusToLiveStatus } from '../utils/sessionMappers';
import { useLiveSessionSocket } from './useLiveSessionSocket';

export const useLiveSessionState = (enrichedSession: EnrichedSession) => {
  const currentUser = useSelector((state: RootState) => state.user.userData);
  const { data: allSessions = [] } = useEnrichedSessions(currentUser?.id);
  const { setCompletedSession } = useSessionCompletion();
  const completedSessions = allSessions.filter(session => session.status === 'completed');

  // Local state
  const [status, setStatus] = useState<LiveSessionStatus>(() =>
    mapFirebaseStatusToLiveStatus(enrichedSession?.liveStatus || '')
  );
  const [userConfirmed, setUserConfirmed] = useState(false);
  const [otherUserConfirmed, setOtherUserConfirmed] = useState(false);
  const [userEndConfirmed, setUserEndConfirmed] = useState(false);
  const [otherUserEndConfirmed, setOtherUserEndConfirmed] = useState(false);

  // Socket handlers
  const handleStatusUpdate = useCallback((data: { liveStatus: string }) => {
    setStatus(mapFirebaseStatusToLiveStatus(data.liveStatus));
  }, []);

  const handleUserConfirmed = useCallback((data: { userId: string }) => {
    if (data.userId === currentUser?.id) {
      setUserConfirmed(true);
    } else {
      setOtherUserConfirmed(true);
    }
  }, [currentUser?.id]);

  const handleUserEndConfirmed = useCallback((data: { userId: string }) => {
    if (data.userId === currentUser?.id) {
      setUserEndConfirmed(true);
    } else {
      setOtherUserEndConfirmed(true);
    }
  }, [currentUser?.id]);

  // Socket connection
  const { confirmSession, confirmEndSession } = useLiveSessionSocket({
    sessionId: enrichedSession?.id || '',
    userId: currentUser?.id || '',
    onStatusUpdate: handleStatusUpdate,
    onUserConfirmed: handleUserConfirmed,
    onUserEndConfirmed: handleUserEndConfirmed,
  });

  // Update status from props
  useEffect(() => {
    if (enrichedSession?.liveStatus) {
      setStatus(mapFirebaseStatusToLiveStatus(enrichedSession.liveStatus));
    }
  }, [enrichedSession?.liveStatus]);

  // Handle completion navigation
  useEffect(() => {
    const isCompleted = completedSessions.some(s => s.id === enrichedSession?.id);
    if (isCompleted && status !== 'completed') {
      setStatus('completed');
      
      // Store session data in context for reliable access on completion page
      setCompletedSession(enrichedSession);
      
      router.push({
        pathname: '/(chat)/session-completed',
        params: { sessionId: enrichedSession.id },
      });
    }
  }, [completedSessions, enrichedSession?.id, enrichedSession, status, setCompletedSession]);

  // for testing
  const forceNavigateToSessionComplete = (sessionId: string) => {
    // Set the session as completed in context first
    setCompletedSession(enrichedSession);
    
    // Then navigate
    router.push({
      pathname: '/(chat)/session-completed',
      params: { sessionId: sessionId },
    });
  };

  return {
    status,
    userConfirmed,
    otherUserConfirmed,
    userEndConfirmed,
    otherUserEndConfirmed,
    confirmSession: () => {
      setUserConfirmed(true);
      confirmSession();
    },
    confirmEndSession: () => {
      setUserEndConfirmed(true);
      confirmEndSession();
    },
  };
};