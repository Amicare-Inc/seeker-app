import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { ProfileScreen, PendingSessionSlider } from '@/features/profile';
import { User } from '@/types/User';
import { SessionCard } from '@/features/sessions';
import { useActiveSession } from '@/lib/context/ActiveSessionContext';

const OtherUserProfileScreen = () => {
	const activeProfileMoreInfo = useSelector(
		(state: RootState) => state.activeProfile.activeUser,
	);
	const { activeEnrichedSession: activeEnrichedProfile } = useActiveSession();
	const activeProfile =
		activeEnrichedProfile?.otherUser || activeProfileMoreInfo;

	// Create a display user for family member cases
	const getDisplayUser = (user: User): User => {
		// If user has family members, show family member profile with core user's care preferences
		if (user.familyMembers && user.familyMembers.length > 0) {
			const familyMember = user.familyMembers[0];
			return {
				...user, // Keep core user's care preferences, address, etc.
				id: user.id, // Keep core user's ID for navigation
				firstName: familyMember.firstName,
				lastName: familyMember.lastName,
				profilePhotoUrl: familyMember.profilePhotoUrl,
				bio: familyMember.bio || user.bio,
				// Keep all other fields from core user (care preferences, etc.)
			};
		}
		return user;
	};

	const displayUser = activeProfile ? getDisplayUser(activeProfile) : null;

	return (
		<>
			<ProfileScreen 
				user={displayUser as User} 
				isMyProfile={false}
				originalUser={activeProfile} // Pass original user for family member cases
			/>
			{activeEnrichedProfile &&
				activeEnrichedProfile.status === 'newRequest' && (
					<SessionCard {...activeEnrichedProfile} />
				)}
		</>
	);
};

export default OtherUserProfileScreen;
