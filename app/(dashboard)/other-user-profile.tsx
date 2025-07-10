import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { ProfileScreen, PendingSessionSlider } from '@/features/profile';
import { User } from '@/types/User';
import { SessionCard } from '@/features/sessions';

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
					<SessionCard {...activeEnrichedProfile} />
				)}
		</>
	);
};

export default OtherUserProfileScreen;
