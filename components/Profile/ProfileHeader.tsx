// @/components/Profile/ProfileHeader.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

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
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
	userName,
	userLocation,
	userRating,
	userPhoto,
	onMenuPress,
	isMyProfile,
	isPsw,
	rate,
	onBackPress,
}) => {
	return (
		<View className="mb-4 flex-row items-center">
			{/* Left side: Back arrow if not my profile */}
			{!isMyProfile && onBackPress && (
				<TouchableOpacity onPress={onBackPress} className="mr-3">
					<Ionicons name="chevron-back" size={24} color="#000" />
				</TouchableOpacity>
			)}

			{/* User Photo */}
			{userPhoto ? (
				<Image
					source={{ uri: userPhoto }}
					className="w-20 h-20 rounded-full mr-3"
				/>
			) : (
				<View className="w-20 h-20 rounded-full bg-gray-300 mr-3" />
			)}

			{/* Middle Column: User info */}
			<View className="flex-1">
				<Text className="text-xl font-semibold text-black">
					{userName}
				</Text>
				{userRating && (
					<View className="flex-row items-center mt-1">
						<Ionicons
							name="checkmark-circle"
							size={16}
							color="#00BFFF"
						/>
						<Text
							className="text-sm ml-1"
							style={{ color: '#797979' }}
						>
							{userRating}
						</Text>
					</View>
				)}
				{userLocation && (
					<Text
						className="text-xs text-gray-500 mt-1"
						style={{ color: '#797979' }}
					>
						{userLocation}
					</Text>
				)}
			</View>

			{/* Right side: If my profile, show menu icon; otherwise, if PSW, show rate */}
			{isMyProfile ? (
				<TouchableOpacity onPress={onMenuPress} className="p-4">
					<Ionicons
						name="ellipsis-horizontal"
						size={24}
						color="#000"
					/>
				</TouchableOpacity>
			) : (
				isPsw &&
				rate != null && (
					<Text
						className="ml-3 text-base font-bold"
						style={{ color: '#797979' }}
					>
						${rate.toFixed()}/hr
					</Text>
				)
			)}
		</View>
	);
};

export default ProfileHeader;
