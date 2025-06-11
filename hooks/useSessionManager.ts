import { useState, useEffect } from 'react';
import { LiveSessionStatus } from '@/types/LiveSession';
import { EnrichedSession } from '@/types/EnrichedSession';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getSocket } from '@/services/node-express-backend/sockets';

const mapFirebaseStatusToLiveStatus = (liveStatus: string): LiveSessionStatus => {
  console.log('Mapping Firebase liveStatus:', liveStatus);
  switch (liveStatus) {
    case 'upcoming':
      return 'waiting';
    case 'ready':
      return 'ready';
    case 'inProgress':
      return 'started';
    default:
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
  const currentUser = useSelector((state: RootState) => state.user.userData);

  // Update status when Firebase liveStatus changes
  useEffect(() => {
    console.log('Status effect triggered:', {
      currentStatus: status,
      liveStatus: enrichedSession?.liveStatus,
      sessionId: enrichedSession?.id
    });

    if (!enrichedSession?.liveStatus) {
      console.log('No Firebase liveStatus available');
      return;
    }

    const newStatus = mapFirebaseStatusToLiveStatus(enrichedSession.liveStatus);
    console.log('Firebase status changed:', {
      oldStatus: status,
      newStatus,
      liveStatus: enrichedSession.liveStatus
    });

    if (newStatus !== status) {
      console.log('Updating status to:', newStatus);
      setStatus(newStatus);
    }
  }, [enrichedSession?.liveStatus, enrichedSession?.id, status]);

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

    // Cleanup
    return () => {
      console.log('Cleaning up socket listeners');
      socket.off('session:liveStatusUpdate');
      socket.off('session:userConfirmed');
      socket.emit('session:leave', enrichedSession.id);
    };
  }, [enrichedSession?.id, currentUser?.id, status]);

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

  return {
    status,
    elapsedTime,
    isCurrentUser: currentUser?.id === enrichedSession.senderId,
    userConfirmed,
    otherUserConfirmed,
    confirmSession,
  };
}; 