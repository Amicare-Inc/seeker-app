// @/components/Profile/ProfileHeader.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { User } from '@/types/User';

interface ProfileHeaderProps {
	userName: string;
	userLocation?: string;
	userRating?: string; // e.g. "4.8 out of 5"
	userPhoto?: string;
	onMenuPress?: () => void; // For the "..." icon
	isMyProfile?: boolean; // If false, show back arrow & rate instead
	isPsw?: boolean; // Indicates if the user is a PSW
	rate?: number; // The user's rate if PSW
	onBackPress?: () => void; // Handler for back arrow
	originalUser?: User; // For family member cases, pass the original user
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
	userName,
	userLocation,
	userRating,
	userPhoto,
	onMenuPress,
	isMyProfile = false,
	isPsw = false,
	rate,
	onBackPress,
	originalUser,
}) => {
	const isShowingFamilyMember = originalUser && originalUser.familyMembers && originalUser.familyMembers.length > 0;
	
	return (
		<View className="flex-row items-center justify-between p-4">
			{/* Left side: Back arrow (if not my profile) */}
			{!isMyProfile && (
				<TouchableOpacity onPress={onBackPress} className="mr-3">
					<Ionicons name="arrow-back" size={24} color="#333" />
				</TouchableOpacity>
			)}

			{/* Profile Photo Section */}
			<View className="relative" style={{ width: isShowingFamilyMember ? 100 : 80 }}>
				{isShowingFamilyMember ? (
					<>
						{/* Family member photo (main position) */}
						<Image
							source={
								userPhoto
									? { uri: userPhoto }
									: require('@/assets/default-profile.png')
							}
							className="w-20 h-20 rounded-full"
							style={{ 
								zIndex: 2,
								shadowColor: '#000', 
								shadowOffset: { width: 0, height: 2 }, 
								shadowOpacity: 0.1, 
								shadowRadius: 4 
							}}
						/>
						{/* Core user photo (slight overlap to the right) */}
						<Image
							source={
								originalUser.profilePhotoUrl
									? { uri: originalUser.profilePhotoUrl }
									: require('@/assets/default-profile.png')
							}
							className="w-20 h-20 rounded-full absolute"
							style={{ 
								right: -30,
								top: 0,
								zIndex: 1,
								shadowColor: '#000', 
								shadowOffset: { width: 0, height: 2 }, 
								shadowOpacity: 0.1, 
								shadowRadius: 4 
							}}
						/>
					</>
				) : (
					<Image
						source={
							userPhoto
								? { uri: userPhoto }
								: require('@/assets/default-profile.png')
						}
						className="w-20 h-20 rounded-full"
						style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}
					/>
				)}
			</View>

			{/* User Info - shifted slightly to accommodate photos */}
			<View className="flex-1" style={{ marginLeft: isShowingFamilyMember ? 36 : 16 }}>
				<Text className="text-xl font-semibold text-gray-800">{userName}</Text>
				{userLocation && (
					<Text className="text-sm text-gray-600 mt-1">{userLocation}</Text>
				)}
				{isShowingFamilyMember ? (
					<Text className="text-sm text-gray-600 mt-1">
						Contact: {originalUser.firstName}
					</Text>
				) : (
					userRating && (
						<Text className="text-sm text-gray-600 mt-1">{userRating}</Text>
					)
				)}
			</View>

			{/* Right side: Menu or Rate */}
			{isMyProfile ? (
				<TouchableOpacity onPress={onMenuPress}>
					{/* <Ionicons name="ellipsis-horizontal" size={24} color="#333" /> */}
				</TouchableOpacity>
			) : (
				<View className="items-center">
					{isPsw && rate && (
						<Text className="text-lg font-semibold text-green-600">
							${rate}/hr
						</Text>
					)}
				</View>
			)}
		</View>
	);
};

export default ProfileHeader;
