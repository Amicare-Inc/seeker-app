// @/components/Profile/ProfileListItem.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ProfileListItemProps {
	label: string;
	iconName?: React.ComponentProps<typeof Ionicons>['name'];
	onPress?: () => void;
	disabled?: boolean;
}

const ProfileListItem: React.FC<ProfileListItemProps> = ({
	label,
	iconName = 'people', // default icon
	onPress,
	disabled,
}) => {
	return (
		<TouchableOpacity
			onPress={onPress}
			disabled={disabled}
			className={`flex-row items-center justify-between px-4 py-3 border-b border-gray-200 ${
				disabled ? 'opacity-50' : ''
			}`}
		>
			<View className="flex-row items-center">
				<Ionicons
					name={iconName}
					size={20}
					color="#000"
					className="mr-3"
				/>
				<Text className="text-sm font-semibold">{label}</Text>
			</View>
			<Ionicons name="chevron-forward" size={18} color="#000" />
		</TouchableOpacity>
	);
};

export default ProfileListItem;
