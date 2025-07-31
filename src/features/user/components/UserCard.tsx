// @/components/UserCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { User } from '@/types/User';

interface UserCardProps {
	user: User;
	onPress: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onPress }) => {
	// Show distance if available, otherwise show city/province
	const locationText = user.address?.city && user.address?.province 
		? `${user.address.city}, ${user.address.province}` 
		: 'Toronto, ON';
	const rate = Math.round(user.rate || 20);

	return (
		<TouchableOpacity
			onPress={onPress}
			className="bg-white rounded-lg p-[12px] mb-[12px] pr-[16px]"
			// Removed shadow styling for a cleaner card look.
		>
			<View className="flex-row items-center">
				<Image
					source={
						user.profilePhotoUrl 
							? { uri: user.profilePhotoUrl }
							: require('@/assets/default-profile.png')
					}
					// Increase profile image to 20x20 and use rounded corners.
					className="w-[58px] h-[58px] rounded-[5px] mr-4"
				/>
				<View className="flex-1">
					<Text className="font-bold text-lg text-black">
						{user.firstName} {user.lastName}
					</Text>
					{/* Show distance if available, otherwise show location */}
					{user.distanceInfo ? (
						<View>
							<Text className="text-sm font-medium text-blue-600">
								{user.distanceInfo.distance}
							</Text>
							<Text className="text-xs text-gray-500">
								{user.distanceInfo.duration}
							</Text>
						</View>
					) : (
						<Text className="text-sm font-semibold text-gray-500">
							{locationText}
						</Text>
					)}
				</View>
				<Text className="font-semibold text-xl text-grey-58 pl-6">
					${rate}/hr
				</Text>
			</View>
		</TouchableOpacity>
	);
};

export default UserCard;
