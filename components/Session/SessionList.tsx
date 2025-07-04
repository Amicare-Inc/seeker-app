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
const SessionList: React.FC<Omit<SessionListProps, 'title'> & { title?: string }> = ({
	sessions,
	onSessionPress,
	title,
}) => {
	// Decide border color based on the title
	let borderColor = 'transparent';
	if (!title) {
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
					className="w-[78px] h-[78px] rounded-full border-4"
					style={{ borderColor }}
				/>
				<Text className="text-sm font-medium mb-[20px] mt-[5px]" style={{ color: '#00000099' }}>
					{item.otherUser.firstName}
				</Text>
			</TouchableOpacity>
		);
	};

	return (
		<View>
			{title && (
				<Text className="text-xl text-black font-medium">{title}</Text>
			)}
			<FlatList
				data={sessions}
				keyExtractor={(item) => item.id}
				renderItem={renderItem}
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{ paddingHorizontal: 4, marginTop: 20 }}
			/>
			{title === 'Pending' && sessions.length === 0 && (
				<View className="w-[78px] h-[78px]" style={{ marginTop: 20, marginLeft: 4 }}>

				</View>
			)}
		</View>
	);
};

export default SessionList;
