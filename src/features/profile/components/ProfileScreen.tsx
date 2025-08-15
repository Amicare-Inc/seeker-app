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
// import ProfileReviews from './ProfileReviews';
import { FIREBASE_AUTH } from '@/firebase.config';
import { clearActiveProfile } from '@/redux/activeProfileSlice';
import { clearUser } from '@/redux/userSlice';
import { useDispatch } from 'react-redux';
import ProfileScore from './ProfileScore';
import ProfileAvailabilityTable from './ProfileAvailabilityTable';

interface ProfileScreenProps {
	user: User;
	isMyProfile: boolean;
	originalUser?: User; // For family member cases, pass the original user
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, isMyProfile, originalUser }) => {
	const {
		firstName,
		lastName,
		address,
		bio,
		// placeholders for your "Diagnoses" / "Experience" etc.
	} = user;

	const handleBackPress = () => {
		router.back();
	};

	return (
		<SafeAreaView
			className="flex-1 px-4 pb-16"
			style={{ backgroundColor: '#f2f2f7' }}
		>
			<ProfileHeader
				userName={`${firstName} ${lastName}`}
				userLocation={
					isMyProfile
						? address?.fullAddress || 'Toronto, ON'
						: address?.city && address?.province
							? `${address.city}, ${address.province}`
							: address?.fullAddress || 'Toronto, ON'
				}
				userRating={
					user.isPsw
						? user.rating
							? `${user.rating.toFixed(1)} out of 5`
							: 'No rating yet'
						: undefined
				}
				userPhoto={user.profilePhotoUrl}
				onMenuPress={() => {}}
				isMyProfile={isMyProfile}
				isPsw={user.isPsw}
				rate={user.rate}
				onBackPress={handleBackPress}
				originalUser={originalUser}
			/>
			<ScrollView className="flex-1">
				{!!bio && (
					<View className="">
						<Text className="font-bold text-black text-base">Bio</Text>
						<ProfileBio bio={bio} />
					</View>
				)}

				<ProfileStats user={user} />

				{!isMyProfile && (
					<>
						<ProfileScore user={user} />
						{user.isPsw && (
							<>
								<ProfileAvailabilityTable user={user} />
							</>
						)}
					</>
				)}

				{isMyProfile ? (
					<>
						<ProfileActionRow user={user} />

						{/* White container for the list items. */}
						<View className="bg-white border-gray-200 rounded-[10px]">
							{!(user.isPsw || user.lookingForSelf === true) && (
								<ProfileListItem
									label="Family"
									iconName="people"
									onPress={() => router.push('/(profile)/family')}
								/>
							)}
							<ProfileListItem
								label="Settings"
								iconName="settings"
								onPress={() => router.push('/(profile)/settings')}
							/>
							{user.isPsw && !user.stripeAccountId && (
															<ProfileListItem
								label="Set up Payouts"
								iconName="card"
								onPress={() => router.push('/(profile)/payouts/stripe-prompt')}
							/>
							)}
							{user.isPsw && !!user.stripeAccountId && (
								<ProfileListItem
									label="Payouts"
									iconName="card"
									disabled
								/>
							)}
							<ProfileListItem
								label="Help"
								iconName="warning"
								onPress={() => router.push('/(profile)/help')}
							/>
							<ProfileListItem
								label="Refer friends"
								iconName="gift"
								onPress={() => router.push('/(profile)/refer')}
							/>
							<ProfileListItem
								label="Legal"
								iconName="document-text"
								onPress={() => router.push('/(profile)/legal')}
							/>
						</View>
					</>
				) : (
					<></>
				)}
			</ScrollView>
		</SafeAreaView>
	);
};

export default ProfileScreen;
