// @/components/Profile/ProfileStats.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { User } from '@/types/User';
import { groupSelectedTasksByCategory } from '@/shared/constants/carePreferencesOnboarding';

interface ProfileStatsProps {
	user: User;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ user }) => {
	const tasks = user.carePreferences?.tasks || [];
	const groups = groupSelectedTasksByCategory(tasks);

	return (
		<View className="mb-4">
			<Text className="font-bold text-black text-base mb-2">
				Seeking help with
			</Text>
			{groups.length === 0 ? (
				<Text className="text-base text-gray-700 mb-3 font-medium" style={styles.wrapText}>
					N/A
				</Text>
			) : (
				groups.map(({ category, tasks: catTasks }) => (
					<View key={category} className="mb-3">
						<Text className="text-sm font-semibold text-gray-800 mb-1">
							{category}
						</Text>
						<Text
							className="text-base text-gray-700 font-medium"
							style={styles.wrapText}
						>
							{catTasks.join(', ')}
						</Text>
					</View>
				))
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	wrapText: {
		flexWrap: 'wrap',
		color: '#797979',
	},
});

export default ProfileStats;
