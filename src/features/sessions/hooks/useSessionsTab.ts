// src/features/sessions/hooks/useSessionsTab.ts
import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { RootState } from '@/redux/store';
import { useActiveSession } from '@/lib/context/ActiveSessionContext';
import { useEnrichedSessions, useNewRequestSession } from '@/features/sessions/api/queries';
import { EnrichedSession } from '@/types/EnrichedSession';
import { setActiveProfile, clearActiveProfile } from '@/redux/activeProfileSlice';

export function useSessionsTab(role: 'psw' | 'seeker') {
	const { setActiveEnrichedSession } = useActiveSession();
	const userId = useSelector((state: RootState) => state.user.userData?.id);
	const dispatch = useDispatch();

	// TODO: RENAME
	const [expandedSession, setExpandedSession] =
		useState<EnrichedSession | null>(null);

	// Fetch sessions using React Query
	const {
		data: allSessions = [],
		isLoading: sessionsLoading,
		error,
		refetch: refetchEnrichedSessions,
	} = useEnrichedSessions(userId);
	//fetch new requested sessions
	const {
		data: newRequestSessions = [],
		isLoading: newRequestsLoading,
		error: newRequestError,
		refetch: refetchNewRequests,
	} = useNewRequestSession(userId);

	const loading = sessionsLoading || newRequestsLoading;

	// Filter sessions by status using useMemo for performance
	const newRequests = useMemo(() => 
		newRequestSessions.filter((session) => {
			// For seekers: show newRequest sessions they receive + interested sessions from PSWs
			if (role === 'seeker') {
				return (session.status === 'newRequest' && session.senderId === userId) ||
					   (session.status === 'interested' && session.receiverId === userId);
			}
			// For PSWs: show ALL newRequest sessions, regardless of receiverId
		
			return session.status === 'newRequest';
		}), [newRequestSessions, userId, role]
	);


	const pending = useMemo(() => 
		allSessions.filter((session) => session.status === 'pending'), 
		[allSessions]
	);
	const applied = useMemo(() => 
		allSessions.filter((session) => session.status === 'applied'), 
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
			// Clear any stale profile and set the correct session user
			if (session.otherUser) {
				dispatch(setActiveProfile(session.otherUser));
			} else {
				dispatch(clearActiveProfile());
			}
			router.push('/other-user-profile');
		} else if (session.status === 'interested') {
			// For interested sessions, navigate to profile page like newRequest
			if (session.otherUser) {
				dispatch(setActiveProfile(session.otherUser));
			} else {
				dispatch(clearActiveProfile());
			}
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
		applied,
		loading,
		error: error ? String(error) : null,
		expandedSession,
		handleExpandSession,
		// expose refetchers so screens can refresh on focus
		refetchEnrichedSessions,
		refetchNewRequests,
	};
} 