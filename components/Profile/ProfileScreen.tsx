// @/components/Profile/ProfileScreen.tsx
import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import ProfileHeader from './ProfileHeader';
import ProfileBio from './ProfileBio';
import ProfileStats from './ProfileStats';
import ProfileActionRow from './ProfileActionRow';
import ProfileListItem from './ProfileListItem';
import { User } from '@/types/User';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import ProfileReviews from './ProfileReviews';
import { FIREBASE_AUTH } from '@/firebase.config';
import { clearActiveProfile } from '@/redux/activeProfileSlice';
import { clearSessions } from '@/redux/sessionSlice';
import { clearUser } from '@/redux/userSlice';
import { useDispatch } from 'react-redux';

interface ProfileScreenProps {
	user: User;
	isMyProfile: boolean;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, isMyProfile }) => {
	const {
		firstName,
		lastName,
		address,
		bio,
		// placeholders for your “Diagnoses” / “Experience” etc.
	} = user;

	// If it’s my profile, we show certain placeholders (e.g. “Cancer, Dementia” vs “Housekeeping, Mobility”).
	// If it’s another user’s profile, we can swap them or rename them “Experience” / “Skills.”
	// const leftTitle = isMyProfile ? "Diagnoses" : "Experience";
	// const leftSubtitle = isMyProfile ? "Cancer, Dementia" : "Dementia, Cancer";
	// const rightTitle = isMyProfile ? "Seeking support with" : "Skills";
	// const rightSubtitle = isMyProfile ? "Housekeeping, Mobility" : "Housekeeping, Mobility";
	const handleBackPress = () => {
		router.back();
	};

	const dispatch = useDispatch();
	const handleSignOut = async () => {
		try {
			// Sign out from Firebase
			await FIREBASE_AUTH.signOut();

			// Clear Redux state
			dispatch(clearUser());
			dispatch(clearSessions());
			dispatch(clearActiveProfile());

			// Navigate to the sign-in screen (or your landing page)
			router.replace('/sign-in');
		} catch (error) {
			console.error('Error signing out:', error);
			// Optionally, show an alert or toast to the user.
		}
	};

	return (
		<SafeAreaView
			className="flex-1 px-4 pb-6"
			style={{ backgroundColor: '#f0f0f0' }}
		>
			<ProfileHeader
				userName={`${firstName} ${lastName}`}
				userLocation={address || 'Midtown, Toronto'}
				userRating="4.8 out of 5"
				userPhoto={user.profilePhotoUrl}
				onMenuPress={() => {}}
				isMyProfile={isMyProfile}
				isPsw={user.isPsw}
				rate={user.rate}
				onBackPress={handleBackPress}
			/>
			<ScrollView className="flex-1">
				{/* Bio Label + Bio */}
				{!!bio && (
					<View className="mb-4">
						<Text className="text-base text-black mb-1">Bio</Text>
						{/* <ProfileBio bio={bio} /> Disabled this because I have no idea why it's making large bottom gap*/}
					</View>
				)}

				<ProfileStats user={user} />

				{/* If it’s my profile, show the row of icons + the list items. */}
				{isMyProfile ? (
					<>
						<ProfileActionRow user={user} />

						{/* White container for the list items. */}
						<View className="bg-white border border-gray-200 rounded-lg mb-4">
							<ProfileListItem
								label="Family"
								iconName="people"
								disabled
							/>
							<ProfileListItem
								label="Settings"
								iconName="settings"
								onPress={() => router.push('/(profile)/settings')}
							/>
							<ProfileListItem
								label="Help"
								iconName="help-circle"
								onPress={() => router.push('/(profile)/help')}
							/>
							<ProfileListItem
								label="Referrals & Rewards"
								iconName="gift"
								onPress={() => router.push('/(profile)/refer')}
							/>
							<ProfileListItem
								label="Legal"
								iconName="document-text"
							/>
							<ProfileListItem
								label="Sign Out"
								iconName="log-out"
								onPress={handleSignOut}
							/>
						</View>
					</>
				) : (
					<>
						<ProfileReviews />
					</>
				)}
			</ScrollView>
		</SafeAreaView>
	);
};

export default ProfileScreen;
