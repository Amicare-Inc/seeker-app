// @/components/Profile/ProfileBio.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProfileBioProps {
	bio?: string;
}

/**
 * A simple bio section, left-aligned, with smaller font size
 * and relaxed line height for a paragraph-like look.
 */
const ProfileBio: React.FC<ProfileBioProps> = ({ bio }) => {
	if (!bio) return null;

	return (
		<View className="mb-4">
			<Text
				className="text-sm text-gray-800 leading-5"
				style={styles.wrapText}
			>
				{bio}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	wrapText: {
		flexWrap: 'wrap',
		color: '#797979',
	},
});

export default ProfileBio;
