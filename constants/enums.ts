// Temporary bridge while code migrates to new shared path
export * from '@/shared/constants/enums';

export enum SessionStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  InProgress = 'inProgress',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

export enum LiveStatus {
  Upcoming = 'upcoming',
  Ready = 'ready',
  Started = 'started',
  Ending = 'ending',
  Ended = 'ended',
} 