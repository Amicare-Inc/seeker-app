import { Session } from './Sessions';
import { User } from './User';

export interface EnrichedSession extends Session {
  // 'otherUser' holds the full user data for whoever is "not the current user"
  otherUser?: User;
}