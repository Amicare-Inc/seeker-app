import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { EnrichedSession } from '@/types/EnrichedSession';

interface SessionListProps {
	sessions: EnrichedSession[];
	onSessionPress: (session: EnrichedSession) => void;
	title?: string;
	isNewRequestsSection?: boolean; // Add prop to identify new requests section
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
	isNewRequestsSection = false,
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
			
			{/* Show "New" rectangle if it's new requests section and empty */}
			{isNewRequestsSection && sessions.length === 0 ? (
				<View 
					className="rounded-xl bg-[#DCDCE166] mb-[24px] border-2 border-dashed border-grey-21"
					style={{ 
						height: 110, 
						marginTop: 10,
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					<Text 
						className="text-lg text-grey-35 font-medium"
						style={{ color: '#999999' }}
					>
						New
					</Text>
				</View>
			) : (
				<ScrollView 
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{ paddingHorizontal: 4, marginTop: 20 }}
				>
					{sessions.length > 0 ? (
						sessions.map((item) => {
							if (!item.otherUser) return null;
							return (
								<TouchableOpacity
									key={item.id}
									onPress={() => onSessionPress(item)}
									className="items-center mr-6"
								>
									<Image
										source={{
											uri: item.otherUser.profilePhotoUrl || 'https://via.placeholder.com/50',
										}}
										className="w-[78px] h-[78px] rounded-full border-4"
										style={{ borderColor }}
									/>
									<Text className="text-sm font-medium mb-[20px] mt-[5px]" style={{ color: '#00000099' }}>
										{item.otherUser.firstName}
									</Text>
								</TouchableOpacity>
							);
						})
					) : title === 'Pending' ? (
						// Invisible placeholder for Pending section to maintain layout
						<View className="items-center mr-6">
							<View className="w-[78px] h-[78px] rounded-full" style={{ opacity: 0 }} />
							<Text className="text-sm font-medium mb-[20px] mt-[5px]" style={{ opacity: 0 }}>
								Placeholder
							</Text>
						</View>
					) : null}
				</ScrollView>
			)}
		</View>
	);
};

export default SessionList;
