import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import ProfileScreen from '@/components/Profile/ProfileScreen';

const SeekerProfileScreen = () => {
	const currentUser = useSelector((state: RootState) => state.user.userData);
	if (!currentUser) {
		return null; // or a loading placeholder
	}
	return <ProfileScreen user={currentUser} isMyProfile={true} />;
};

export default SeekerProfileScreen;
