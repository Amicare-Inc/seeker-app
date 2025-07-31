// @/components/SessionBookedList.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { EnrichedSession } from '@/types/EnrichedSession';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getSessionDisplayInfo } from '@/features/sessions/utils/sessionDisplayUtils';

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
	const currentUser = useSelector((state: RootState) => state.user.userData);

	const renderItem = ({ item }: { item: EnrichedSession }) => {
		if (!item.otherUser || !currentUser) return null;

		const displayInfo = getSessionDisplayInfo(item, currentUser);

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
				className="mb-[12px]"
			>
				<View className="rounded-full w-[360px] h-[84px] flex-row items-center justify-between bg-[#0e7ae2] pl-4 pr-12">
						<View className="flex-row items-center">
							<Image
								source={
									displayInfo.primaryPhoto
										? { uri: displayInfo.primaryPhoto }
										: require('@/assets/default-profile.png')
								}
								className="w-[60px] h-[60px] rounded-full"
							/>
							<View className="ml-3">
								<Text
									className="text-white text-lg font-semibold"
									numberOfLines={1}
									ellipsizeMode="tail"
								>
									{mainLabel.length > 10
										? `${mainLabel.substring(0, 13)}...`
										: mainLabel}
								</Text>
								<Text
									className="text-sm font-medium"
									style={{ color: 'rgba(255,255,255,0.85)' }}
								>
									with {displayInfo.primaryName.split(' ')[0]}
								</Text>
							</View>
						</View>
						<View className="">
							<Text className="text-white text-lg font-semibold">
								{formattedDate}
							</Text>
							<Text 
								className="text-sm"
								style={{ color: 'rgba(255,255,255,0.85)' }}
							>
								{formattedTime}
							</Text>
						</View>
				</View>
			</TouchableOpacity>
		);
	};

	return (
		<View>
			<Text className="text-xl text-black font-medium mt-[10px] mb-[20px]">{title}</Text>
			<ScrollView 
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingHorizontal: 4 }}
			>
				{sessions.map((item) => {
					if (!item.otherUser || !currentUser) return null;

					const displayInfo = getSessionDisplayInfo(item, currentUser);

					// Use item.note (only the first value before a comma) as the main label.
					const mainLabel = item.note ? item.note.split(',')[0].trim() : '';

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
							key={item.id}
							onPress={() => onSessionPress(item)}
							className="mb-[12px]"
						>
							<View className="rounded-full w-[360px] h-[84px] flex-row items-center justify-between bg-[#0e7ae2] pl-4 pr-12">
								<View className="flex-row items-center">
									<Image
										source={
											displayInfo.primaryPhoto
												? { uri: displayInfo.primaryPhoto }
												: require('@/assets/default-profile.png')
										}
										className="w-[58px] h-[58px] rounded-full mr-4"
									/>
									<View className="ml-3">
										<Text
											className="text-white text-lg font-semibold"
											numberOfLines={1}
											ellipsizeMode="tail"
										>
											{mainLabel.length > 10
												? `${mainLabel.substring(0, 13)}...`
												: mainLabel}
										</Text>
										<Text
											className="text-sm font-medium"
											style={{ color: 'rgba(255,255,255,0.85)' }}
										>
											with {displayInfo.primaryName.split(' ')[0]}
										</Text>
									</View>
								</View>
								<View className="">
									<Text className="text-white text-lg font-semibold">
										{formattedDate}
									</Text>
									<Text 
										className="text-sm"
										style={{ color: 'rgba(255,255,255,0.85)' }}
									>
										{formattedTime}
									</Text>
								</View>
							</View>
						</TouchableOpacity>
					);
				})}
			</ScrollView>
		</View>
	);
};

export default SessionBookedList;
