import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';
import { EnrichedSession } from '@/types/EnrichedSession';

// Basic selectors
const selectSessions = (state: RootState) => state.sessions.allSessions;
const selectUserMap = (state: RootState) => state.user.allUsers;
const selectCurrentUserId = (state: RootState) => state.user.userData?.id;

export const selectEnrichedSessions = createSelector(
  [selectSessions, selectUserMap, selectCurrentUserId],
  (sessions, userMap, currentUserId) => {
    return sessions.map(session => {
      // figure out which user is "otherUser"
      let otherUserId: string | undefined;
      if (session.senderId === currentUserId) {
        otherUserId = session.receiverId;
      } else {
        otherUserId = session.senderId;
      }

      const enriched: EnrichedSession = {
        ...session,
        otherUser: otherUserId ? userMap[otherUserId] : undefined,
      };
      console.log('Enriched SESSIONS:', enriched); // debug log
      return enriched;
    });
  }
);