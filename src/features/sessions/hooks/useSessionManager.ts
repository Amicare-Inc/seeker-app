import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';
import { EnrichedSession } from '@/types/EnrichedSession';
import { LiveSessionStatus } from '@/types/LiveSession';
import { RootState } from '@/redux/store';
import { selectCompletedSessions } from '@/redux/selectors';
import { getSocket } from '@/src/features/socket';

const mapFirebaseStatusToLiveStatus = (liveStatus: string): LiveSessionStatus => {
  console.log('Mapping Firebase status:', liveStatus);
  
  switch (liveStatus) {
    case 'upcoming':
      return 'waiting';
    case 'ready':
      return 'ready';
    case 'started':
      return 'started';
    case 'ending':
      return 'ending';
    case 'completed':
      return 'completed';
    default:
      console.log('Unknown status, defaulting to waiting');
      return 'waiting';
  }
};

export const useSessionManager = (enrichedSession: EnrichedSession) => {
  // console.log('useSessionManager called with session:', {
  //   id: enrichedSession?.id,
  //   status: enrichedSession?.status,
  //   startTime: enrichedSession?.startTime,
  //   liveStatus: enrichedSession?.liveStatus,
  //   liveStatusUpdatedAt: enrichedSession?.liveStatusUpdatedAt
  // });

  // Initialize with the current session status
  const [status, setStatus] = useState<LiveSessionStatus>(() => {
    const initialStatus = mapFirebaseStatusToLiveStatus(enrichedSession?.liveStatus || '');
    console.log('Initial status set to:', initialStatus);
    return initialStatus;
  });
  
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [userConfirmed, setUserConfirmed] = useState<boolean>(false);
  const [otherUserConfirmed, setOtherUserConfirmed] = useState<boolean>(false);
  const [userEndConfirmed, setUserEndConfirmed] = useState<boolean>(false);
  const [otherUserEndConfirmed, setOtherUserEndConfirmed] = useState<boolean>(false);
  const currentUser = useSelector((state: RootState) => state.user.userData);
  const completedSessions = useSelector(selectCompletedSessions);

  // Watch for session completion via Redux
  useEffect(() => {
    if (!enrichedSession?.id) return;
    
    const isSessionCompleted = completedSessions.some(session => session.id === enrichedSession.id);
    
    if (isSessionCompleted && status !== 'completed') {
      console.log('🎯 Session completed detected via Redux, navigating to completion screen');
      console.log('📱 Session data:', {
        id: enrichedSession.id,
        status: enrichedSession.status,
        completedSessionsCount: completedSessions.length
      });
      
      setStatus('completed');
      
      try {
        router.push({
          pathname: '/session-completed',
          params: {
            sessionId: enrichedSession.id
          }
        });
        console.log('✅ Navigation to completion screen successful');
      } catch (navigationError) {
        console.error('❌ Navigation to completion screen failed:', navigationError);
      }
    }
  }, [completedSessions, enrichedSession?.id, status]);

  // Update status when Firebase liveStatus changes
  useEffect(() => {
    console.log('🔍 Status effect triggered:', {
      currentStatus: status,
      liveStatus: enrichedSession?.liveStatus,
      sessionId: enrichedSession?.id,
      sessionStatus: enrichedSession?.status
    });

    if (!enrichedSession?.liveStatus) {
      console.log('❌ No Firebase liveStatus available');
      return;
    }

    const newStatus = mapFirebaseStatusToLiveStatus(enrichedSession.liveStatus);
    console.log('🔄 Firebase status mapping:', {
      oldStatus: status,
      newStatus,
      liveStatus: enrichedSession.liveStatus,
      sessionStatus: enrichedSession.status
    });

    if (newStatus !== status) {
      console.log('✅ Updating status to:', newStatus);
      setStatus(newStatus);
      

    } else {
      console.log('⚠️ Status unchanged, not updating');
    }
  }, [enrichedSession?.liveStatus, enrichedSession?.id, enrichedSession?.status]);

  useEffect(() => {
    if (!enrichedSession?.id || !currentUser?.id) {
      console.log('Missing required data for socket connection:', {
        sessionId: enrichedSession?.id,
        userId: currentUser?.id
      });
      return;
    }

    const socket = getSocket();
    if (!socket) {
      console.error('Socket not connected');
      return;
    }

    console.log('Connecting to session socket:', {
      sessionId: enrichedSession.id,
      currentStatus: status,
      liveStatus: enrichedSession.liveStatus
    });

    // Join the session room
    socket.emit('session:join', enrichedSession.id);

    // Listen for live status updates
    socket.on('session:liveStatusUpdate', (data: { sessionId: string; liveStatus: string }) => {
      console.log('Received status update:', data);
      if (data.sessionId === enrichedSession.id) {
        const newStatus = mapFirebaseStatusToLiveStatus(data.liveStatus);
        console.log('Setting status from socket update:', newStatus);
        setStatus(newStatus);
      }
    });

    // Listen for user confirmations
    socket.on('session:userConfirmed', (data: { sessionId: string; userId: string }) => {
      console.log('Received user confirmation:', data);
      if (data.sessionId === enrichedSession.id) {
        if (data.userId === currentUser.id) {
          setUserConfirmed(true);
        } else {
          setOtherUserConfirmed(true);
        }
      }
    });

    // Listen for end session confirmations
    socket.on('session:userEndConfirmed', (data: { sessionId: string; userId: string }) => {
      console.log('🔚 Received user end confirmation:', data);
      if (data.sessionId === enrichedSession.id) {
        if (data.userId === currentUser.id) {
          setUserEndConfirmed(true);
        } else {
          setOtherUserEndConfirmed(true);
        }
      }
    });



    // Cleanup
    return () => {
      console.log('🧹 Cleaning up socket listeners');
      socket.off('session:liveStatusUpdate');
      socket.off('session:userConfirmed');
      socket.off('session:userEndConfirmed');
      socket.emit('session:leave', enrichedSession.id);
    };
  }, [enrichedSession?.id, currentUser?.id]);

  // Handle elapsed time for started sessions
  useEffect(() => {
    if (status !== 'started' || !enrichedSession?.startTime) {
      setElapsedTime(0);
      return;
    }

    const startTime = new Date(enrichedSession.startTime).getTime();
    const updateElapsedTime = () => {
      const now = new Date().getTime();
      setElapsedTime(now - startTime);
    };

    // Initial update
    updateElapsedTime();

    // Update every second
    const intervalId = setInterval(updateElapsedTime, 1000);

    return () => clearInterval(intervalId);
  }, [status, enrichedSession?.startTime]);



  const confirmSession = () => {
    console.log('Confirming session:', { 
      sessionId: enrichedSession?.id, 
      userId: currentUser?.id,
      status: status
    });
    
    const socket = getSocket();
    if (!socket || !enrichedSession?.id || !currentUser?.id) {
      console.error('Cannot confirm session - missing required data');
      return;
    }

    setUserConfirmed(true);
    socket.emit('session:userConfirm', {
      sessionId: enrichedSession.id,
      userId: currentUser.id
    });
  };

  const confirmEndSession = () => {
    console.log('Confirming end session:', { 
      sessionId: enrichedSession?.id, 
      userId: currentUser?.id,
      status: status
    });
    
    const socket = getSocket();
    if (!socket || !enrichedSession?.id || !currentUser?.id) {
      console.error('Cannot confirm end session - missing required data');
      return;
    }

    setUserEndConfirmed(true);
    socket.emit('session:userEndConfirm', {
      sessionId: enrichedSession.id,
      userId: currentUser.id
    });
  };

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