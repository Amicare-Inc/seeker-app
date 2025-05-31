import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { EnrichedSession } from '@/types/EnrichedSession';

interface SessionListProps {
	sessions: EnrichedSession[];
	onSessionPress: (session: EnrichedSession) => void;
	title: string;
}

/**
 * Displays a horizontal row of bigger circle avatars with the user’s first name below each.
 * - New Requests: Gray (#ccc) border
 * - Pending: #1A8BF8 border
 */
const SessionList: React.FC<SessionListProps> = ({
	sessions,
	onSessionPress,
	title,
}) => {
	// Decide border color based on the title
	let borderColor = 'transparent';
	if (title === 'New Requests') {
		borderColor = '#797979'; // gray border
	} else if (title === 'Pending') {
		borderColor = '#1A8BF8'; // #1A8BF8 border
	}

	const renderItem = ({ item }: { item: EnrichedSession }) => {
		if (!item.otherUser) return null;

		return (
			<TouchableOpacity
				onPress={() => onSessionPress(item)}
				className="items-center mr-6"
			>
				<Image
					source={{
						uri:
							item.otherUser.profilePhotoUrl ||
							'https://via.placeholder.com/50',
					}}
					// Add border-2 from Tailwind, and override the color inline
					className="w-20 h-20 rounded-full mb-2 border-4"
					style={{ borderColor }}
				/>
				<Text className="text-base" style={{ color: '#000000' }}>
					{item.otherUser.firstName}
				</Text>
			</TouchableOpacity>
		);
	};

	return (
		<View className="mt-5">
			<Text className="text-xl mb-3 text-black">{title}</Text>
			<FlatList
				data={sessions}
				keyExtractor={(item) => item.id}
				renderItem={renderItem}
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{ paddingHorizontal: 4 }}
			/>
		</View>
	);
};

export default SessionList;
