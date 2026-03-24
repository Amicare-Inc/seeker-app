// @/components/Profile/ProfileActionRow.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User } from '@/types/User';
import { router } from 'expo-router';

interface ProfileActionRowProps {
	user: User;
}

const ProfileActionRow: React.FC<ProfileActionRowProps> = () => {
	return (
		<View>
			<View className="flex-row gap-[10px] mb-[10px]">
				<TouchableOpacity
					onPress={() => router.push('/(profile)/session_history')}
					className="bg-white rounded-[10px] flex-1 items-center p-3"
					activeOpacity={0.7}
				>
					<Ionicons name="calendar" size={26} color="#000" />
					<Text className="text-sm font-medium mt-2 text-[#303031]">History</Text>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={() => router.push('/(profile)/edit_profile')}
					className="bg-white rounded-[10px] flex-1 items-center p-3"
					activeOpacity={0.7}
				>
					<Ionicons name="person" size={26} color="#000" />
					<Text className="text-sm font-medium mt-2 text-[#303031]">Edit Profile</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default ProfileActionRow;
