import { useEffect, useState, useRef } from 'react';
import { LiveStatus } from '@/shared/constants/enums';

/**
 * Returns an increasing timer (in seconds) that starts counting when
 * `liveStatus === 'started'` and a valid `liveStatusUpdatedAt` timestamp
 * is supplied.  The timer pauses / resets when the status is not 'started'.
 */
export const useElapsedTimer = (
  liveStatus: string | undefined | null,
  liveStatusUpdatedAt: any,
): number => {
  const [timer, setTimer] = useState(0);
  const intervalId = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Helper to translate various Firebase timestamp formats to Date.
    const parseTimestamp = (timestamp: any): Date | null => {
      if (!timestamp) return null;
      if (timestamp instanceof Date) return timestamp;
      if (typeof timestamp === 'string' || typeof timestamp === 'number') {
        const date = new Date(timestamp);
        return isNaN(date.getTime()) ? null : date;
      }
      // Firebase Timestamp with _seconds / _nanoseconds
      if (timestamp?._seconds !== undefined) {
        const { _seconds = 0, _nanoseconds = 0 } = timestamp;
        return new Date(_seconds * 1000 + _nanoseconds / 1e6);
      }
      // Firebase Timestamp with toDate()
      if (typeof timestamp?.toDate === 'function') {
        return timestamp.toDate();
      }
      return null;
    };

    const clearExisting = () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    };

    // Only start timer if session is actively started.
    if (liveStatus === LiveStatus.Started) {
      const startDate = parseTimestamp(liveStatusUpdatedAt);
      if (!startDate) {
        setTimer(0);
        return;
      }

      // Tick immediately so UI shows 00:00 right away.
      const tick = () => {
        const now = new Date();
        const secs = Math.floor((now.getTime() - startDate.getTime()) / 1000);
        setTimer(Math.max(secs, 0));
      };

      tick();
      intervalId.current = setInterval(tick, 1000);
    } else {
      // Not started – ensure timer is reset.
      setTimer(0);
    }

    return clearExisting;
  }, [liveStatus, liveStatusUpdatedAt]);

  return timer;
}; 