import { EnrichedSession } from '@/types/EnrichedSession';

export type LiveSessionStatus = 'waiting' | 'ready' | 'started' | 'ending' | 'completed';

export interface LiveSessionTimer {
  startTime: string;
  endTime: string;
  status: LiveSessionStatus;
  note: string;
  userConfirmation: {
    [userId: string]: boolean;
  };
}

export interface LiveSessionCardProps {
  session: EnrichedSession;
  onExpand?: () => void;
  onCollapse?: () => void;
}

export interface LiveSessionHeaderProps {
  enrichedSession: EnrichedSession;
  expanded: boolean;
  onToggle: () => void;
  formatTimeUntilSession?: (startTime: string | undefined | null) => string;
}

export interface LiveSessionTimerProps {
  startTime: string;
  endTime: string;
  note: string;
  status: LiveSessionStatus;
  elapsedTime?: number;
}

export interface LiveSessionActionsProps {
  onMessage: () => void;
  onReportIssue: () => void;
  onEmergency: () => void;
  onEndSession: () => void;
  sessionStatus: LiveSessionStatus;
}

export interface LiveSessionExpandedProps {
  session: EnrichedSession;
  onConfirmStart: () => void;
  onEndSession: () => void;
  status: LiveSessionStatus;
} 