// src/hooks/useAvailableUsers.ts
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchAvailableUsers, fetchAvailableUsersWithDistance } from '@/redux/userListSlice';
import { useMemo } from 'react';
import { User } from '@/types/User';

const useAvailableUsers = (isPsw: boolean, withDistance: boolean = true) => {
	const dispatch = useDispatch<AppDispatch>();
	const { users, loading, error } = useSelector((state: RootState) => state.userList);

	useEffect(() => {
		if (withDistance) {
			// Try to fetch with distance first
			dispatch(fetchAvailableUsersWithDistance({ isPsw }));
		} else {
			// Fallback to regular fetch without distance
			dispatch(fetchAvailableUsers({ isPsw }));
		}
	}, [dispatch, isPsw, withDistance]);

	return { users, loading, error };
};

const useHomeUsers = (isPsw: boolean, filteredUsers?: User[] | null) => {
	// Get the fetched users using your existing hook.
	const { users: fetchedUsers, loading, error } = useAvailableUsers(isPsw);
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

	const baseUsers = filteredUsers ?? fetchedUsers;

	// Filter out users who are already engaged.
	const availableUsers = useMemo(() => {
		return baseUsers.filter((user: User) => !engagedUserIds.includes(user.id!));
	}, [baseUsers, engagedUserIds]);

	return { users: availableUsers, loading, error };
};

export default useAvailableUsers;
export { useHomeUsers };
