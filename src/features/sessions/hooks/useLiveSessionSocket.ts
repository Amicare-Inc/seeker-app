import { useEffect } from 'react';
import { joinSessionRoom, leaveSessionRoom, getSocket } from '@/src/features/socket';
import { SocketPayloads } from '@/shared/constants/socketEvents';

interface UseLiveSessionSocketProps {
  sessionId?: string;
  userId?: string;
  onStatusUpdate?: (data: SocketPayloads['session:liveStatusUpdate']) => void;
  onUserConfirmed?: (data: SocketPayloads['session:userConfirmed']) => void;
  onUserEndConfirmed?: (data: SocketPayloads['session:userEndConfirmed']) => void;
}

export const useLiveSessionSocket = ({
  sessionId,
  userId,
  onStatusUpdate,
  onUserConfirmed,
  onUserEndConfirmed,
}: UseLiveSessionSocketProps) => {
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !sessionId || !userId) return;

    // Join session room using the new function
    joinSessionRoom(sessionId);

    // Setup listeners
    const handleStatusUpdate = (data: SocketPayloads['session:liveStatusUpdate']) => {
      if (data.sessionId === sessionId) {
        onStatusUpdate?.(data);
      }
    };

    const handleUserConfirmed = (data: SocketPayloads['session:userConfirmed']) => {
      if (data.sessionId === sessionId) {
        onUserConfirmed?.(data);
      }
    };

    const handleUserEndConfirmed = (data: SocketPayloads['session:userEndConfirmed']) => {
      if (data.sessionId === sessionId) {
        onUserEndConfirmed?.(data);
      }
    };

    socket.on('session:liveStatusUpdate', handleStatusUpdate);
    socket.on('session:userConfirmed', handleUserConfirmed);
    socket.on('session:userEndConfirmed', handleUserEndConfirmed);

    return () => {
      socket.off('session:liveStatusUpdate', handleStatusUpdate);
      socket.off('session:userConfirmed', handleUserConfirmed);
      socket.off('session:userEndConfirmed', handleUserEndConfirmed);
      leaveSessionRoom(sessionId);
    };
  }, [sessionId, userId, onStatusUpdate, onUserConfirmed, onUserEndConfirmed]);

  const confirmSession = () => {
    const socket = getSocket();
    if (!socket) return;

    socket.emit('session:userConfirm', {
      sessionId,
      userId,
    });
  };

  const confirmEndSession = () => {
    const socket = getSocket();
    if (!socket) return;

    socket.emit('session:userEndConfirm', {
      sessionId,
      userId,
    });
  };

  return { confirmSession, confirmEndSession };
}; 