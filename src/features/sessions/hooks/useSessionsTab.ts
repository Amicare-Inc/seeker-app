// src/features/sessions/hooks/useSessionsTab.ts
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'expo-router';
import { AppDispatch, RootState } from '@/redux/store';
import { setActiveEnrichedSession } from '@/redux/sessionSlice';
import { EnrichedSession } from '@/types/EnrichedSession';
import {
	selectNewRequestSessions,
	selectPendingSessions,
	selectConfirmedSessions,
	selectCancelledSessions,
	selectInProgressSessions,
	selectCompletedSessions,
	selectFailedSessions,
} from '@/redux/selectors';

export function useSessionsTab(role: 'psw' | 'seeker') {
	const dispatch = useDispatch<AppDispatch>();

	// TODO: RENAME
	const [expandedSession, setExpandedSession] =
		useState<EnrichedSession | null>(null);

	const newRequests = useSelector(selectNewRequestSessions);
	const pending = useSelector(selectPendingSessions);
	const confirmed = useSelector(selectConfirmedSessions);
	const cancelled = useSelector(selectCancelledSessions);
	const inProgress = useSelector(selectInProgressSessions);
	const completed = useSelector(selectCompletedSessions);
	const failed = useSelector(selectFailedSessions);

	// console.log('New in useSessionsTab (Selectors):', { newRequests });

	// Select loading and error directly from the slice
	const loading = useSelector(
		(state: RootState) => state.sessions,
	).loading;
	const error = useSelector(
		(state: RootState) => state.sessions,
	).error;
	const userId = useSelector((state: RootState) => state.user.userData?.id);

	/**
	 * If a session is 'confirmed' or 'pending', navigate to chat.
	 * Otherwise, open the other user profile
	 * // TODO: RENAME THIS BETTER
	 */
	const handleExpandSession = (session: EnrichedSession) => {
		dispatch(setActiveEnrichedSession(session));
		if (session.status === 'confirmed' || session.status === 'pending') {
			router.push({
				pathname: '/(chat)/[sessionId]',
				params: { sessionId: session.id },
			});
		} else if (session.status === 'newRequest') {
			router.push('/other-user-profile');
		} else { //TODO REMOVE THIS
			setExpandedSession(session);
		}
	};

	return {
		newRequests,
		pending,
		cancelled,
		inProgress,
		completed,
		failed,
		confirmed,
		loading,
		error,
		expandedSession,
		handleExpandSession,
	};
} 