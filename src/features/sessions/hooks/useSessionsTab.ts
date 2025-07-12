// src/features/sessions/hooks/useSessionsTab.ts
import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';
import { RootState } from '@/redux/store';
import { useActiveSession } from '@/lib/context/ActiveSessionContext';
import { useEnrichedSessions } from '@/features/sessions/api/queries';
import { EnrichedSession } from '@/types/EnrichedSession';

export function useSessionsTab(role: 'psw' | 'seeker') {
	const { setActiveEnrichedSession } = useActiveSession();
	const userId = useSelector((state: RootState) => state.user.userData?.id);

	// TODO: RENAME
	const [expandedSession, setExpandedSession] =
		useState<EnrichedSession | null>(null);

	// Fetch sessions using React Query
	const { data: allSessions = [], isLoading: loading, error } = useEnrichedSessions(userId);

	// Filter sessions by status using useMemo for performance
	const newRequests = useMemo(() => 
		allSessions.filter((session) => 
			session.status === 'newRequest' && session.receiverId === userId
		), [allSessions, userId]
	);

	const pending = useMemo(() => 
		allSessions.filter((session) => session.status === 'pending'), 
		[allSessions]
	);

	const confirmed = useMemo(() => 
		allSessions.filter((session) => session.status === 'confirmed'), 
		[allSessions]
	);

	const cancelled = useMemo(() => 
		allSessions.filter((session) => session.status === 'cancelled'), 
		[allSessions]
	);

	const inProgress = useMemo(() => 
		allSessions.filter((session) => session.status === 'inProgress'), 
		[allSessions]
	);

	const completed = useMemo(() => 
		allSessions.filter((session) => session.status === 'completed'), 
		[allSessions]
	);

	const failed = useMemo(() => 
		allSessions.filter((session) => session.status === 'failed'), 
		[allSessions]
	);

	/**
	 * If a session is 'confirmed' or 'pending', navigate to chat.
	 * Otherwise, open the other user profile
	 * // TODO: RENAME THIS BETTER
	 */
	const handleExpandSession = (session: EnrichedSession) => {
		setActiveEnrichedSession(session);
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
		error: error ? String(error) : null,
		expandedSession,
		handleExpandSession,
	};
} 