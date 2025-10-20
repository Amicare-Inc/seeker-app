import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { ProfileScreen } from '@/features/profile';
import { LAYOUT_CONSTANTS } from '@/shared/constants/layout';

const SeekerProfileScreen = () => {
	const currentUser = useSelector((state: RootState) => state.user.userData);
	if (!currentUser) {
		return null; // or a loading placeholder
	}
	return (
		<View style={{ flex: 1, paddingTop: LAYOUT_CONSTANTS.SCREEN_TOP_PADDING }}>
			<ProfileScreen user={currentUser} isMyProfile={true} />
		</View>
	);
};

export default SeekerProfileScreen;
