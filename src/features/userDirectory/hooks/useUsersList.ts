// src/hooks/useUsersList.ts
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useAvailableUsers } from '@/features/userDirectory/api/queries';

const useUsersList = (isPsw: boolean) => {
	const currentUserId = useSelector((state: RootState) => state.user.userData?.id);
	const userType = isPsw ? 'psw' : 'seeker';
	
	const usersQuery = useAvailableUsers(userType, currentUserId);

	return { 
		users: usersQuery.data || [], 
		loading: usersQuery.isLoading, 
		error: usersQuery.error?.message || null 
	};
};

export default useUsersList;
