// src/hooks/useSessionsTab.ts
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'expo-router';
import { AppDispatch, RootState } from '@/redux/store';
import {
	updateSessionStatus,
	setActiveEnrichedSession,
	acceptSessionThunk,
	rejectSessionThunk,
} from '@/redux/sessionSlice';
import { EnrichedSession } from '@/types/EnrichedSession';
import { setActiveProfile } from '@/redux/activeProfileSlice';
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

	// This tracks the session displayed in the modal
	const [expandedSession, setExpandedSession] =
		useState<EnrichedSession | null>(null);

	// Redux state from your session slice
	// const { newRequests, pending, confirmed, loading, error } = useSelector(
	// 	(state: RootState) => state.sessions,
	// );

	// Select filtered session arrays using memoized selectors
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
		} else {
			setExpandedSession(session);
		}
	};

	const handleCloseModal = () => {
		setExpandedSession(null);
	};
	// TODO: REMOVE THIS
	const handleAction = async (action: 'accept' | 'reject') => {
		if (!expandedSession) return;

		// let newStatus = '';
		// if (expandedSession.status === 'newRequest') {
		// 	newStatus = action === 'accept' ? 'pending' : 'rejected';
		// }

		try {
			if (action === 'accept') {
				console.log('Accepting session: in ACTION', expandedSession);
				// await dispatch(acceptSessionThunk(expandedSession));
			} else if (action === 'reject') {
				await dispatch(rejectSessionThunk(expandedSession.id));
			}
			// await dispatch(
			// 	updateSessionStatus({
			// 		sessionId: expandedSession.id,
			// 		newStatus,
			// 	}),
			// );
			setExpandedSession(null);
		} catch (err) {
			console.error('Error updating session status:', err);
		}
	};

	// If you want to fetch user details for the modal, you can do so here. For now, returning null.
	const getUserForExpandedSession = () => {
		return null;
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
		handleCloseModal,
		handleAction,
		getUserForExpandedSession,
	};
}
