import { useEffect, useRef, useState } from 'react';
import { isSocketConnected, pingSocket, getSocketStatus, connectSocket } from '../api/socketApi';
import { logger } from '@/lib/logger';

const healthLogger = logger.child('[SocketHealth]');

interface SocketHealthState {
  isConnected: boolean;
  status: string;
  lastPing?: number;
  reconnectAttempts: number;
}

interface UseSocketHealthOptions {
  pingInterval?: number; // How often to ping (ms)
  maxReconnectAttempts?: number;
  enabled?: boolean;
}

export const useSocketHealth = (
  userId?: string,
  options: UseSocketHealthOptions = {}
) => {
  const {
    pingInterval = 30000, // 30 seconds
    maxReconnectAttempts = 3,
    enabled = true,
  } = options;

  const [healthState, setHealthState] = useState<SocketHealthState>({
    isConnected: false,
    status: 'disconnected',
    reconnectAttempts: 0,
  });

  const pingIntervalRef = useRef<any>();
  const reconnectTimeoutRef = useRef<any>();
  const lastPingRef = useRef<number>(0);

  // Monitor connection status
  useEffect(() => {
    if (!enabled || !userId) return;

    const checkStatus = () => {
      const connected = isSocketConnected();
      const status = getSocketStatus();

      setHealthState(prev => {
        const newState = {
          ...prev,
          isConnected: connected,
          status,
        };

        if (!connected && prev.reconnectAttempts < maxReconnectAttempts) {
          healthLogger.warn('Socket disconnected - attempting reconnection', {
            attempt: prev.reconnectAttempts + 1,
            maxAttempts: maxReconnectAttempts,
          });

          newState.reconnectAttempts = prev.reconnectAttempts + 1;

          // Attempt reconnection with exponential backoff
          const delay = Math.pow(2, prev.reconnectAttempts) * 1000; // 1s, 2s, 4s...
          reconnectTimeoutRef.current = setTimeout(() => {
            connectSocket(userId);
          }, delay);
        }

        return newState;
      });
    };

    // Initial check
    checkStatus();

    // Set up periodic status checks
    const statusInterval = setInterval(checkStatus, 5000); // Check every 5 seconds

    return () => {
      clearInterval(statusInterval);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [enabled, userId, maxReconnectAttempts]);

  // Set up ping monitoring
  useEffect(() => {
    if (!enabled || !healthState.isConnected) return;

    const doPing = async () => {
      try {
        const latency = await pingSocket();
        const now = Date.now();
        
        setHealthState(prev => ({
          ...prev,
          lastPing: latency,
          reconnectAttempts: 0, // Reset on successful ping
        }));

        lastPingRef.current = now;
        healthLogger.debug('Socket ping successful', { latency });
      } catch (error: any) {
        healthLogger.warn('Socket ping failed', { error: error?.message || 'Unknown error' });
        // Let the status checker handle reconnection
      }
    };

    // Initial ping
    doPing();

    // Set up periodic pings
    pingIntervalRef.current = setInterval(doPing, pingInterval);

    return () => {
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
    };
  }, [enabled, healthState.isConnected, pingInterval]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  const forceReconnect = () => {
    if (!userId) return;
    
    healthLogger.info('Forcing socket reconnection');
    setHealthState(prev => ({ ...prev, reconnectAttempts: 0 }));
    connectSocket(userId);
  };

  return {
    ...healthState,
    forceReconnect,
    isHealthy: healthState.isConnected && (healthState.lastPing ?? 0) < 10000, // < 10s latency
  };
}; 