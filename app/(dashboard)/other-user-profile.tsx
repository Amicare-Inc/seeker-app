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
	// Fix: Prioritize actively selected user over session user to prevent stuck profiles
	const activeProfile =
		activeProfileMoreInfo || activeEnrichedProfile?.otherUser || null;

	// Create a display user for family member cases
	const getDisplayUser = (user: User): User => {
		// Check if this is a family member card (transformed by useHomeTab)
		if (user.isFamilyMemberCard && user.familyMemberInfo) {
			// Use the specific family member that was clicked
			const familyMember = user.familyMemberInfo;
			// Check if this is family care or self care to get availability from correct location
			const isFamily = user.lookingForSelf === false;
			const availabilitySource = isFamily 
				? familyMember.carePreferences?.availability // Family member's availability
				: user.carePreferences?.availability; // Core user's availability
			
			return {
				...user, // Keep core user data for billing/communication
				id: user.id, // Keep core user's ID
				firstName: familyMember.firstName,
				lastName: familyMember.lastName,
				profilePhotoUrl: familyMember.profilePhotoUrl,
				bio: familyMember.bio || user.bio,
				address: familyMember.address,
				// Use family member's care preferences with correct availability source
				carePreferences: {
					...familyMember.carePreferences, // Family member's care types, tasks, etc.
					availability: availabilitySource, // Availability from correct location
				},
			};
		}
		// If there's an active session with specific family member data, use that
		else if (activeEnrichedProfile?.isForFamilyMember && activeEnrichedProfile?.careRecipientData && user.familyMembers) {
			const careRecipient = activeEnrichedProfile.careRecipientData;
			// Find the actual family member from the user's family members array to get care preferences
			const actualFamilyMember = user.familyMembers.find(member => 
				member.firstName === careRecipient.firstName && 
				member.lastName === careRecipient.lastName
			);
			
			if (actualFamilyMember) {
				// Check if this is family care or self care to get availability from correct location
				const isFamily = user.lookingForSelf === false;
				const availabilitySource = isFamily 
					? actualFamilyMember.carePreferences?.availability // Family member's availability
					: user.carePreferences?.availability; // Core user's availability
				
				return {
					...user, // Keep core user data for billing/communication
					id: user.id, // Keep core user's ID for navigation
					firstName: careRecipient.firstName,
					lastName: careRecipient.lastName,
					profilePhotoUrl: careRecipient.profilePhotoUrl,
					bio: actualFamilyMember.bio || user.bio, // Use family member's bio, fallback to core user's
					address: careRecipient.address,
					// Use family member's care preferences with correct availability source
					carePreferences: {
						...actualFamilyMember.carePreferences, // Family member's care types, tasks, etc.
						availability: availabilitySource, // Availability from correct location
					},
				};
			}
		}
		// If user has family members but this is not a family member card, show family member profile with correct availability
		else if (user.familyMembers && user.familyMembers.length > 0) {
			const familyMember = user.familyMembers[0];
			// Check if this is family care or self care to get availability from correct location
			const isFamily = user.lookingForSelf === false;
			const availabilitySource = isFamily 
				? familyMember.carePreferences?.availability // Family member's availability
				: user.carePreferences?.availability; // Core user's availability
			
			return {
				...user, // Keep core user's care preferences, address, etc.
				id: user.id, // Keep core user's ID for navigation
				firstName: familyMember.firstName,
				lastName: familyMember.lastName,
				profilePhotoUrl: familyMember.profilePhotoUrl,
				bio: familyMember.bio || user.bio,
				// Use family member's care preferences with correct availability source
				carePreferences: {
					...familyMember.carePreferences, // Family member's care types, tasks, etc.
					availability: availabilitySource, // Availability from correct location
				},
			};
		}
		return user;
	};

	const displayUser = activeProfile ? getDisplayUser(activeProfile) : null;
	
	// Debug logging for PSW profile viewing
	if (displayUser && activeProfile) {
		const isFamily = activeProfile.lookingForSelf === false;
		console.log('PSW viewing profile - DETAILED DEBUG:', {
			displayUserName: `${displayUser.firstName} ${displayUser.lastName}`,
			originalUserName: `${activeProfile.firstName} ${activeProfile.lastName}`,
			lookingForSelf: activeProfile.lookingForSelf,
			isFamily: isFamily,
			hasFamilyMembers: !!activeProfile.familyMembers?.length,
			familyMembersCount: activeProfile.familyMembers?.length || 0,
			availabilitySource: isFamily ? 'family member' : 'core user',
			hasAvailability: !!displayUser.carePreferences?.availability,
			availability: displayUser.carePreferences?.availability,
			// More detailed family member info
			familyMemberData: activeProfile.familyMembers?.[0] ? {
				name: `${activeProfile.familyMembers[0].firstName} ${activeProfile.familyMembers[0].lastName}`,
				hasCarePreferences: !!activeProfile.familyMembers[0].carePreferences,
				hasAvailability: !!activeProfile.familyMembers[0].carePreferences?.availability,
				availability: activeProfile.familyMembers[0].carePreferences?.availability
			} : 'No family member',
			// Core user data
			coreUserData: {
				hasCarePreferences: !!activeProfile.carePreferences,
				hasAvailability: !!activeProfile.carePreferences?.availability,
				availability: activeProfile.carePreferences?.availability
			}
		});
	}

	return (
		<>
			{displayUser && (
				<ProfileScreen 
					user={displayUser || undefined} 
					isMyProfile={false}
					originalUser={activeProfile || undefined} // Pass original user for family member cases
				/>
			)}
			{activeEnrichedProfile &&
				activeEnrichedProfile.status === 'newRequest' && (
					<SessionCard {...activeEnrichedProfile} />
				)}
		</>
	);
};

export default OtherUserProfileScreen;
