import { LiveSessionStatus } from '@/types/LiveSession';

export const mapFirebaseStatusToLiveStatus = (liveStatus: string): LiveSessionStatus => {
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
      return 'waiting';
  }
}; 