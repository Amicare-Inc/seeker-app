import { EnrichedSession } from '@/types/EnrichedSession';
import { Message } from '@/types/Message';
import { ChecklistItem } from '@/types/Sessions';

export type SocketPayloads = {
  'session:update': EnrichedSession[];
  'session:started': { sessionId: string; actualStartTime: string };
  'session:completed': { sessionId: string; actualEndTime: string };
  'session:booked': { sessionId: string; status: string; bookedBy: string; updatedAt: string };
  'chat:newMessage': Message[];
  'chat:notify': { sessionId: string; lastMessageAt: string; lastMessageBy: string };
  'chat:readReceipt': { sessionId: string; userId: string; lastReadAt: string };
  'session:liveStatusUpdate': { sessionId: string; liveStatus: string };
  'session:userConfirmed': { sessionId: string; userId: string };
  'session:userEndConfirmed': { sessionId: string; userId: string };
  // ✅ Add missing checklist and comment events for production reliability
  'checklist:updated': { sessionId: string; checklist: ChecklistItem[]; updatedBy: string };
  'comment:added': { sessionId: string; comment: any; addedBy: string };
};

export type SocketEvent = keyof SocketPayloads; 