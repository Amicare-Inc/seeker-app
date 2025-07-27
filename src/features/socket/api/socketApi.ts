import { io, Socket } from 'socket.io-client';
import { AppState, AppStateStatus } from 'react-native';
import 'firebase/auth';
import { FIREBASE_AUTH } from '@/firebase.config';
import { logger } from '@/lib/logger';

const socketLogger = logger.child('[SocketAPI]');

let socket: Socket | null = null;
let currentUserId: string | null = null;
let appStateSubscription: any = null;

// Track active rooms for reconnection
const activeRooms = new Set<string>();
const activeChatSessions = new Set<string>();

export const connectSocket = async (userId: string) => {
  // Prevent duplicate connections
  if (socket?.connected && currentUserId === userId) {
    socketLogger.debug('Socket already connected for user', { userId });
    return socket;
  }

  // Disconnect existing socket if different user
  if (socket && currentUserId !== userId) {
    socketLogger.info('Disconnecting socket for user change', { 
      oldUserId: currentUserId, 
      newUserId: userId 
    });
    disconnectSocket();
  }

  currentUserId = userId;
  const user = FIREBASE_AUTH.currentUser;

  try {
    socketLogger.info('Connecting socket', { userId });

    // ✅ Production-ready socket configuration
    socket = io(process.env.EXPO_PUBLIC_BACKEND_BASE_URL, {
      query: { userId },
      
      // ✅ Critical reliability improvements
      transports: ['websocket', 'polling'], // Allow fallback to long-polling
      upgrade: true, // Allow transport upgrades
      
      // ✅ Reconnection settings
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      
      // ✅ Connection timeout
      timeout: 10000,
      
      // ✅ Force new connection
      forceNew: true,
      
      // ✅ Additional production settings
      randomizationFactor: 0.5,
      autoConnect: true,
    });

          // ✅ Enhanced connection event handlers with production reliability
      socket.on('connect', () => {
        socketLogger.info('Socket connected', {
          socketId: socket?.id,
          transport: socket?.io.engine.transport.name,
          userId
        });

        // Rejoin all active rooms after reconnection
        rejoinActiveRooms();
        
        // ✅ Enhanced connection monitoring for production - send heartbeat to maintain connection
        const heartbeatInterval = setInterval(() => {
          if (socket?.connected) {
            socket.emit('ping', Date.now());
            socketLogger.debug('Heartbeat sent', { userId });
          } else {
            socketLogger.warn('Heartbeat stopped - socket disconnected', { userId });
            clearInterval(heartbeatInterval);
          }
        }, 30000); // Every 30 seconds
        
        // Store interval reference for cleanup
        (socket as any).heartbeatInterval = heartbeatInterval;
      });

    socket.on('disconnect', (reason) => {
      socketLogger.warn('Socket disconnected', { reason, userId });
    });

    socket.on('connect_error', (error) => {
      socketLogger.error('Socket connection error', { 
        error: error.message, 
        userId,
        errorDetails: error.toString()
      });
    });

    // ✅ Reconnection event handlers
    socket.on('reconnect', (attemptNumber) => {
      socketLogger.info('Socket reconnected', { attemptNumber, userId });
      rejoinActiveRooms();
    });

    socket.on('reconnect_attempt', (attemptNumber) => {
      socketLogger.debug('Socket reconnection attempt', { attemptNumber, userId });
    });

    socket.on('reconnect_failed', () => {
      socketLogger.error('Socket reconnection failed after all attempts', { userId });
    });

    socket.on('reconnect_error', (error) => {
      socketLogger.error('Socket reconnection error', { 
        error: error.message, 
        userId 
      });
    });

    // ✅ Transport upgrade logging
    socket.io.engine.on('upgrade', () => {
      socketLogger.info('Socket transport upgraded', { 
        transport: socket?.io.engine.transport.name 
      });
    });

    // ✅ Handle app state changes for production
    setupAppStateHandling(userId);

    socketLogger.info('Socket setup complete', { userId });
    return socket;

  } catch (error: any) {
    socketLogger.error('Error setting up socket connection', { 
      error: error.message, 
      userId 
    });
    throw error;
  }
};

// ✅ Room management functions following your patterns
export const joinSessionRoom = (sessionId: string) => {
  if (!socket?.connected) {
    socketLogger.warn('Cannot join session room - socket not connected', { sessionId });
    return;
  }

  activeRooms.add(`session:${sessionId}`);
  socket.emit('session:join', sessionId);
  socketLogger.debug('Joined session room', { sessionId });
};

export const leaveSessionRoom = (sessionId: string) => {
  if (!socket?.connected) {
    socketLogger.warn('Cannot leave session room - socket not connected', { sessionId });
    return;
  }

  activeRooms.delete(`session:${sessionId}`);
  socket.emit('session:leave', sessionId);
  socketLogger.debug('Left session room', { sessionId });
};

export const joinChatSession = (sessionId: string) => {
  if (!socket?.connected) {
    socketLogger.warn('Cannot join chat session - socket not connected', { sessionId });
    return;
  }

  activeChatSessions.add(sessionId);
  socket.emit('chat:joinSession', sessionId);
  socketLogger.debug('Joined chat session', { sessionId });
};

export const leaveChatSession = (sessionId: string) => {
  if (!socket?.connected) {
    socketLogger.warn('Cannot leave chat session - socket not connected', { sessionId });
    return;
  }

  activeChatSessions.delete(sessionId);
  socket.emit('chat:leaveSession', sessionId);
  socketLogger.debug('Left chat session', { sessionId });
};

// ✅ Rejoin all active rooms after reconnection
const rejoinActiveRooms = () => {
  if (!socket?.connected) return;

  socketLogger.info('Rejoining active rooms', { 
    sessionRooms: activeRooms.size, 
    chatSessions: activeChatSessions.size 
  });

  // Rejoin session rooms
  activeRooms.forEach(room => {
    if (room.startsWith('session:')) {
      const sessionId = room.replace('session:', '');
      socket?.emit('session:join', sessionId);
      socketLogger.debug('Rejoined session room', { sessionId });
    }
  });

  // Rejoin chat sessions
  activeChatSessions.forEach(sessionId => {
    socket?.emit('chat:joinSession', sessionId);
    socketLogger.debug('Rejoined chat session', { sessionId });
  });
};

// ✅ App state handling for production reliability
const setupAppStateHandling = (userId: string) => {
  // Remove existing subscription
  if (appStateSubscription) {
    appStateSubscription.remove();
  }

  appStateSubscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
    socketLogger.debug('App state changed', { nextAppState, userId });

    if (nextAppState === 'active') {
      // App became active - check socket connection
      if (!socket || !socket.connected) {
        socketLogger.info('App became active - reconnecting socket', { userId });
        connectSocket(userId);
      }
    } else if (nextAppState === 'background') {
      // App went to background - socket will handle this automatically
      socketLogger.debug('App went to background', { userId });
    }
  });
};

// ✅ Connection health monitoring
export const isSocketConnected = (): boolean => {
  return socket?.connected ?? false;
};

export const getSocketStatus = () => {
  if (!socket) return 'disconnected';
  return socket.connected ? 'connected' : 'disconnected';
};

// ✅ Ping for connection health check
export const pingSocket = (): Promise<number> => {
  return new Promise((resolve, reject) => {
    if (!socket?.connected) {
      reject(new Error('Socket not connected'));
      return;
    }

    const start = Date.now();
    socket.emit('ping', start, () => {
      const latency = Date.now() - start;
      resolve(latency);
    });

    // Timeout after 5 seconds
    setTimeout(() => reject(new Error('Ping timeout')), 5000);
  });
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socketLogger.info('Disconnecting socket manually', { userId: currentUserId });

    // ✅ Clean up heartbeat interval
    if ((socket as any).heartbeatInterval) {
      clearInterval((socket as any).heartbeatInterval);
      (socket as any).heartbeatInterval = null;
    }

    // Clean up all listeners
    socket.off();
    socket.disconnect();
    socket = null;
  }

  // Clean up state
  currentUserId = null;
  activeRooms.clear();
  activeChatSessions.clear();

  // Remove app state subscription
  if (appStateSubscription) {
    appStateSubscription.remove();
    appStateSubscription = null;
  }

  socketLogger.info('Socket disconnected and cleaned up');
}; 