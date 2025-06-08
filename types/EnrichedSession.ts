import { Session } from './Sessions';
import { User } from './User';
import { ChecklistItem } from '@/components/Session/OngoingSession/SessionChecklistBox';

export interface EnrichedSession extends Session {
	// 'otherUser' holds the full user data for whoever is "not the current user"
	otherUser?: User;
	checklist?: ChecklistItem[];
}
