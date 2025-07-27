import { useEffect, useState, useRef } from 'react';
import { LiveStatus } from '@/shared/constants/enums';

interface CountdownResult {
  countdown: string;
  timeLeft: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  isExpired: boolean;
}

/**
 * Real-time countdown timer that updates every second until the target time.
 * Returns formatted countdown string and time components.
 * Only runs when liveStatus is 'upcoming'.
 */
export const useCountdownTimer = (
  startTime: string | undefined | null,
  liveStatus: string | undefined | null,
): CountdownResult => {
  const [result, setResult] = useState<CountdownResult>({
    countdown: '',
    timeLeft: { hours: 0, minutes: 0, seconds: 0 },
    isExpired: false,
  });
  
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const clearExisting = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    // Only run countdown for upcoming sessions
    if (liveStatus !== LiveStatus.Upcoming || !startTime) {
      clearExisting();
      setResult({
        countdown: '',
        timeLeft: { hours: 0, minutes: 0, seconds: 0 },
        isExpired: false,
      });
      return;
    }

    const updateCountdown = () => {
      const now = new Date().getTime();
      const target = new Date(startTime).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setResult({
          countdown: 'Starting now',
          timeLeft: { hours: 0, minutes: 0, seconds: 0 },
          isExpired: true,
        });
        clearExisting();
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      let countdown = '';
      if (hours > 0) {
        countdown = `${hours}h ${minutes}m`;
      } else if (minutes > 0) {
        countdown = `${minutes}m ${seconds}s`;
      } else {
        countdown = `${seconds}s`;
      }

      setResult({
        countdown,
        timeLeft: { hours, minutes, seconds },
        isExpired: false,
      });
    };

    // Update immediately and then every second
    updateCountdown();
    intervalRef.current = setInterval(updateCountdown, 1000);

    return clearExisting;
  }, [startTime, liveStatus]);

  return result;
}; 