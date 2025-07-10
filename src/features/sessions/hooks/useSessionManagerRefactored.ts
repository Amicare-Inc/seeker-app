import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { EnrichedSession } from '@/types/EnrichedSession';
import { RootState } from '@/redux/store';
import { useLiveSessionState } from './useLiveSessionState';
import { useElapsedTimer } from './useElapsedTimer';

export const useSessionManager = (enrichedSession: EnrichedSession) => {
  const currentUser = useSelector((state: RootState) => state.user.userData);
  
  const {
    status,
    userConfirmed,
    otherUserConfirmed,
    userEndConfirmed,
    otherUserEndConfirmed,
    confirmSession,
    confirmEndSession,
  } = useLiveSessionState(enrichedSession);

  // Timer for started sessions
  const [elapsedTime, setElapsedTime] = useState(0);
  
  useEffect(() => {
    if (status !== 'started' || !enrichedSession?.startTime) {
      setElapsedTime(0);
      return;
    }

    const startTime = new Date(enrichedSession.startTime).getTime();
    const updateElapsedTime = () => {
      setElapsedTime(new Date().getTime() - startTime);
    };

    updateElapsedTime();
    const intervalId = setInterval(updateElapsedTime, 1000);
    return () => clearInterval(intervalId);
  }, [status, enrichedSession?.startTime]);

  return {
    status,
    elapsedTime,
    isCurrentUser: currentUser?.id === enrichedSession.senderId,
    userConfirmed,
    otherUserConfirmed,
    userEndConfirmed,
    otherUserEndConfirmed,
    confirmSession,
    confirmEndSession,
  };
}; 