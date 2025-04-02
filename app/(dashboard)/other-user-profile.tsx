import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import ProfileScreen from '@/components/Profile/ProfileScreen';
import { User } from '@/types/User';
import PendingSessionSlider from '@/components/Profile/PendingSessionSlider';

const OtherUserProfileScreen = () => {
	const activeProfileMoreInfo = useSelector(
		(state: RootState) => state.activeProfile.activeUser,
	);
	const activeEnrichedProfile = useSelector(
		(state: RootState) => state.sessions.activeEnrichedSession,
	);
	const activeProfile =
		activeEnrichedProfile?.otherUser || activeProfileMoreInfo;

	return (
		<>
			<ProfileScreen user={activeProfile as User} isMyProfile={false} />
			{activeEnrichedProfile &&
				activeEnrichedProfile.status === 'newRequest' && (
					<PendingSessionSlider session={activeEnrichedProfile} />
				)}
		</>
	);
};

export default OtherUserProfileScreen;
