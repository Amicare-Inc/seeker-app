import { EnrichedSession } from '@/types/EnrichedSession';
import { Message } from '@/types/Message';

export type SocketPayloads = {
  'session:update': EnrichedSession[];
  'session:started': { sessionId: string; actualStartTime: string };
  'session:completed': { sessionId: string; actualEndTime: string };
  'session:booked': { sessionId: string; status: string; bookedBy: string; updatedAt: string };
  'chat:newMessage': Message[];
  'session:liveStatusUpdate': { sessionId: string; liveStatus: string };
  'session:userConfirmed': { sessionId: string; userId: string };
  'session:userEndConfirmed': { sessionId: string; userId: string };
};

export type SocketEvent = keyof SocketPayloads; 