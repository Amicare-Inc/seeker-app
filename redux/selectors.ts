import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';
import { EnrichedSession } from '@/types/EnrichedSession';

const selectSessionState = (state: RootState) => state.sessions;

export const selectAllSessions = createSelector(selectSessionState,(sessionState) => sessionState.allSessions);
export const selectNewRequestSessions = createSelector(
  [selectAllSessions, (state: RootState) => state.user.userData?.id],
  (allSessions, currentUserId) =>
    allSessions.filter(
      (session) =>
        session.status === 'newRequest' && session.receiverId === currentUserId
    )
);
export const selectPendingSessions = createSelector(selectAllSessions,(allSessions) => allSessions.filter((session) => session.status === 'pending'));
export const selectConfirmedSessions = createSelector(selectAllSessions,(allSessions) => allSessions.filter((session) => session.status === 'confirmed'));
export const selectCancelledSessions = createSelector(selectAllSessions, (allSessions) => allSessions.filter((session) => session.status === 'cancelled'));
export const selectInProgressSessions = createSelector(selectAllSessions, (allSessions) => allSessions.filter((session) => session.status === 'inProgress'));
export const selectCompletedSessions = createSelector(selectAllSessions, (allSessions) => allSessions.filter((session) => session.status === 'completed'));
export const selectFailedSessions = createSelector(selectAllSessions, (allSessions) => allSessions.filter((session) => session.status === 'failed'));

const selectSessions = (state: RootState) => state.sessions.allSessions;
const selectUserMap = (state: RootState) => state.user.allUsers;
const selectCurrentUserId = (state: RootState) => state.user.userData?.id;

export const selectEnrichedSessions = createSelector(
	[selectSessions, selectUserMap, selectCurrentUserId],
	(sessions, userMap, currentUserId) => {
		return sessions.map((session) => {
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
	},
);
