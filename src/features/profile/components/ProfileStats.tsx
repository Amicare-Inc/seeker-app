// @/components/Profile/ProfileStats.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { User } from '@/types/User';

interface ProfileStatsProps {
	user: User;
}

/**
 * Displays two lines:
 * 1) Type of care (provided/interested in)
 * 2) Tasks (assisting by / seeking support with)
 * Both are left-aligned.
 */
const ProfileStats: React.FC<ProfileStatsProps> = ({ user }) => {
	

	// Titles based on role
	const tasksTitle = 'Seeking support with:';
	const availabilityTitle = 'Times I need support:';

	// Data extraction
	const tasks = user.carePreferences?.tasks?.join(', ') || 'N/A';

	// Build availability string  e.g., "Mon 18h-20h • Wed 17h-19h"
	const availabilityObj = user.carePreferences?.availability || {};
	const availabilityStrings: string[] = [];
	for (const [day, slots] of Object.entries(availabilityObj)) {
		const dayAbbrev = day.slice(0, 3); // Mon, Tue, etc.
		if (Array.isArray(slots)) {
			slots.forEach(({ start, end }) => {
				availabilityStrings.push(`${dayAbbrev} ${start}-${end}`);
			});
		}
	}
	const availabilityText = availabilityStrings.join(' · ') || 'N/A';

	// Care type title
	const careTypeTitle = 'Requiring help with:';
	const careType = user.carePreferences?.careType?.join(', ') || 'N/A';

	return (
		<View className="mb-4">
			{/* Care Type */}
			<Text className="font-bold text-black text-base mb-1">
				{careTypeTitle}
			</Text>
			<Text className="text-base text-gray-700 mb-3 font-medium" style={styles.wrapText}>
				{careType}
			</Text>

			{/* Tasks / Seeking support */}
			<Text className="font-bold text-black text-base mb-1">
				{tasksTitle}
			</Text>
			<Text className="text-base text-gray-700 mb-3 font-medium" style={styles.wrapText}>
				{tasks}
			</Text>

			{/* Availability
			<Text className="font-bold text-black text-base mb-1">
				{availabilityTitle}
			</Text>
			<Text className="text-sm text-gray-700" style={styles.wrapText}>
				{availabilityText}
			</Text> */}
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
