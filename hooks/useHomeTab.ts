// src/hooks/useAvailableUsers.ts
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import useUsersList from './useUsersList';
import { RootState } from '@/redux/store';
import { User } from '@/types/User';

const useHomeUsers = (isPsw: boolean, filteredUsers?: User[] | null) => {
	// Get the fetched users using your existing hook.
	const { users, loading, error } = useUsersList(isPsw);
	// Get the current user ID.
	const currentUserId = useSelector(
		(state: RootState) => state.user.userData?.id,
	);
	// Get all active sessions from your sessions slice.
	const allSessions = useSelector(
		(state: RootState) => state.sessions.allSessions,
	);

	// Build a list of engaged user IDs (users that already have sessions with the current user).
	const engagedUserIds = useMemo(() => {
		if (!currentUserId) return [];
		return allSessions.reduce<string[]>((acc, session) => {
			if (session.senderId === currentUserId) {
				acc.push(session.receiverId);
			} else if (session.receiverId === currentUserId) {
				acc.push(session.senderId);
			}
			return acc;
		}, []);
	}, [allSessions, currentUserId]);

	const baseUsers = filteredUsers ?? users;

	// Filter out users who are already engaged.
	const availableUsers = useMemo(() => {
		return baseUsers.filter((user) => !engagedUserIds.includes(user.id!));
	}, [baseUsers, engagedUserIds]);

	return { users: availableUsers, loading, error };
};

export default useHomeUsers;
