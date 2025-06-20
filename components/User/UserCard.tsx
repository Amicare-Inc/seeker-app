// @/components/UserCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { User } from '@/types/User';

interface UserCardProps {
	user: User;
	onPress: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onPress }) => {
	const locationText = user.address || 'Toronto, ON';
	const rate = user.rate || 20;

	return (
		<TouchableOpacity
			onPress={onPress}
			className="bg-white rounded-lg p-[12px] mb-[12px] pr-[16px]"
			// Removed shadow styling for a cleaner card look.
		>
			<View className="flex-row items-center">
				<Image
					source={{
						uri:
							user.profilePhotoUrl ||
							'https://via.placeholder.com/50',
					}}
					// Increase profile image to 20x20 and use rounded corners.
					className="w-[58px] h-[58px] rounded-[5px] mr-4"
				/>
				<View className="flex-1">
					<Text className="font-semibold text-base text-black">
						{user.firstName} {user.lastName}
					</Text>
					<Text className="text-xs text-gray-500">
						{locationText}
					</Text>
				</View>
				<Text className="font-medium text-base text-grey-58 pl-6">
					${rate}/hr
				</Text>
			</View>
		</TouchableOpacity>
	);
};

export default UserCard;
