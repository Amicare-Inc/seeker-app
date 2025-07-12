// src/hooks/useAvailableUsers.ts
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { User } from '@/types/User';
import { useAvailableUsers, useAvailableUsersWithDistance } from '@/features/userDirectory/api/queries';

const useAvailableUsersHook = (isPsw: boolean, withDistance: boolean = true) => {
	const currentUserId = useSelector((state: RootState) => state.user.userData?.id);
	const userType = isPsw ? 'psw' : 'seeker';
	
	const usersQuery = withDistance 
		? useAvailableUsersWithDistance(userType, currentUserId)
		: useAvailableUsers(userType, currentUserId);

	return { 
		users: usersQuery.data || [], 
		loading: usersQuery.isLoading, 
		error: usersQuery.error?.message || null 
	};
};

const useHomeUsers = (isPsw: boolean) => {
	return useAvailableUsersHook(isPsw, false);
};

const useHomeUsersWithDistance = (isPsw: boolean) => {
	return useAvailableUsersHook(isPsw, true);
};

export const useHomeTab = (isPsw: boolean, withDistance: boolean = true) => {
	return withDistance 
		? useHomeUsersWithDistance(isPsw)
		: useHomeUsers(isPsw);
};
