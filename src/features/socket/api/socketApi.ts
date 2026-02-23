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

    // ✅ Production-ready socket configuration with iOS enhancements
    socket = io(process.env.EXPO_PUBLIC_BACKEND_BASE_URL, {
      query: { userId },
      
      // ✅ Critical reliability improvements
      transports: ['websocket'], // Force native WebSocket
      upgrade: true, // Allow transport upgrades
      
      // ✅ Reconnection settings - more aggressive for iOS
      reconnection: true,
      reconnectionAttempts: 10, // Increased from 5 for iOS
      reconnectionDelay: 500, // Reduced from 1000 for faster iOS reconnection
      reconnectionDelayMax: 3000, // Reduced from 5000 for iOS
      
      // ✅ Connection timeout - reduced for faster iOS failover
      timeout: 5000, // Reduced from 10000
      
      // ✅ Force new connection
      forceNew: true,
      
      // ✅ Additional production settings with iOS optimizations
      randomizationFactor: 0.3, // Reduced for more predictable iOS reconnection
      autoConnect: true,
      
      // ✅ Enhanced for iOS WebSocket reliability
      rememberUpgrade: false, // Don't remember transport upgrades for iOS consistency
      forceBase64: false, // Allow binary for better iOS performance
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
        }, 15000); // Reduced from 30000 to 15000 for better iOS reliability
        
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

export const joinAdminChat = (chatId: string) => {
  if (!socket?.connected) {
    socketLogger.warn('Cannot join admin chat - socket not connected', { chatId });
    return;
  }

  socket.emit('admin-chat:join', chatId);
  socketLogger.debug('Joined admin chat', { chatId });
};

export const leaveAdminChat = (chatId: string) => {
  if (!socket?.connected) {
    socketLogger.warn('Cannot leave admin chat - socket not connected', { chatId });
    return;
  }

  socket.emit('admin-chat:leave', chatId);
  socketLogger.debug('Left admin chat', { chatId });
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

// ✅ App state handling for production reliability with iOS enhancements
const setupAppStateHandling = (userId: string) => {
  // Remove existing subscription
  if (appStateSubscription) {
    appStateSubscription.remove();
  }

  appStateSubscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
    socketLogger.debug('App state changed', { nextAppState, userId });

    if (nextAppState === 'active') {
      // App became active - check socket connection more aggressively on iOS
      if (!socket || !socket.connected) {
        socketLogger.info('App became active - reconnecting socket', { userId });
        connectSocket(userId);
      }
      // Force rejoin rooms on iOS app activation
      setTimeout(() => {
        rejoinActiveRooms();
      }, 100);
    } else if (nextAppState === 'background') {
      // App went to background - socket will handle this automatically
      socketLogger.debug('App went to background', { userId });
    } else if (nextAppState === 'inactive') {
      // iOS-specific: App became inactive (during call, control center, etc.)
      socketLogger.debug('App became inactive', { userId });
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