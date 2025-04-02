// @/components/SessionBookedList.tsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { EnrichedSession } from '@/types/EnrichedSession';
import { LinearGradient } from 'expo-linear-gradient';

interface SessionBookedListProps {
	sessions: EnrichedSession[];
	onSessionPress: (session: EnrichedSession) => void;
	title: string;
}

/**
 * Displays a vertical list of larger "blue pill" cards for confirmed sessions,
 * with a bigger avatar and a right panel showing the start time (on top) and the start date (without year) underneath.
 */
const SessionBookedList: React.FC<SessionBookedListProps> = ({
	sessions,
	onSessionPress,
	title,
}) => {
	const renderItem = ({ item }: { item: EnrichedSession }) => {
		if (!item.otherUser) return null;

		// Use item.note (only the first value before a comma) as the main label.
		const mainLabel = item.note ? item.note.split(',')[0].trim() : '';
		const otherName = item.otherUser.firstName;

		// Format the start time.
		const formattedTime = item.startTime
			? new Date(item.startTime).toLocaleTimeString([], {
					hour: '2-digit',
					minute: '2-digit',
				})
			: 'Time?';

		// Format the start date without the year.
		const formattedDate = item.startTime
			? new Date(item.startTime).toLocaleDateString('en-US', {
					month: 'short',
					day: 'numeric',
				})
			: 'No Date';

		return (
			<TouchableOpacity
				onPress={() => onSessionPress(item)}
				className="mb-6"
			>
				<LinearGradient
					start={{ x: 0, y: 0.5 }}
					end={{ x: 1, y: 0.5 }}
					colors={['#008DF4', '#5CBAFF']}
					className="rounded-full px-4 py-3"
				>
					<View className="flex-row items-center justify-between">
						<View className="flex-row items-center">
							<Image
								source={{
									uri:
										item.otherUser.profilePhotoUrl ||
										'https://via.placeholder.com/50',
								}}
								className="w-16 h-16 rounded-full"
							/>
							<View className="ml-3">
								<Text className="text-white text-lg">
									{mainLabel}
								</Text>
								<Text
									className="text-base"
									style={{ color: '#fff' }}
								>
									with {otherName}
								</Text>
							</View>
						</View>
						<View className="ml-2 items-end">
							<Text className="text-white text-lg">
								{formattedTime}
							</Text>
							<Text className="text-white text-base">
								{formattedDate}
							</Text>
						</View>
					</View>
				</LinearGradient>
			</TouchableOpacity>
		);
	};

	return (
		<View className="mt-8">
			<Text className="text-xl mb-3 text-black">{title}</Text>
			<FlatList
				data={sessions}
				keyExtractor={(item) => item.id}
				renderItem={renderItem}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingHorizontal: 4 }}
			/>
		</View>
	);
};

export default SessionBookedList;
