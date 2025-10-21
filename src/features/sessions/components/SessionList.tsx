import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { EnrichedSession } from '@/types/EnrichedSession';
import { getSessionDisplayInfo } from '@/features/sessions/utils/sessionDisplayUtils';
import { useUnreadBadge } from '@/features/chat/unread/useUnread';

const AvatarWithUnread: React.FC<{ uri?: string; borderColor: string; sessionId: string }> = ({ uri, borderColor, sessionId }) => {
    const { unread } = useUnreadBadge(sessionId);
    return (
        <View style={{ position: 'relative', overflow: 'visible' }}>
            <Image
                source={uri ? { uri } : require('@/assets/default-profile.png')}
                className="w-[78px] h-[78px] rounded-full border-4"
                style={{ borderColor }}
            />
            {unread ? (
                <View
                    style={{
                        position: 'absolute',
                        right: 4,
                        top: 4,
                        width: 14,
                        height: 14,
                        borderRadius: 7,
                        backgroundColor: '#FF3B30',
                        zIndex: 10,
                        elevation: 3,
                    }}
                />
            ) : null}
        </View>
    );
};

interface SessionListProps {
	sessions: EnrichedSession[];
	onSessionPress: (session: EnrichedSession) => void;
	title?: string;
	isNewRequestsSection?: boolean; // Add prop to identify new requests section
}

/**
 * Displays a horizontal row of bigger circle avatars with the user's first name below each.
 * - New Requests: Gray (#ccc) border
 * - Pending: #1A8BF8 border
 */
const SessionList: React.FC<SessionListProps> = ({
	sessions,
	onSessionPress,
	title,
	isNewRequestsSection = false,
}) => {
	const currentUser = useSelector((state: RootState) => state.user.userData);

	// Decide border color based on the title
	let borderColor = 'transparent';
	if (!title) {
		borderColor = '#797979'; // gray border
	} else if (title === 'Pending') {
		borderColor = '#1A8BF8'; // #1A8BF8 border
	}

	const renderItem = ({ item }: { item: EnrichedSession }) => {
		if (!item.otherUser || !currentUser) return null;

		const displayInfo = getSessionDisplayInfo(item, currentUser);

		return (
			<TouchableOpacity
				onPress={() => onSessionPress(item)}
				className="items-center mr-6"
			>
                                    <AvatarWithUnread uri={displayInfo.primaryPhoto} borderColor={borderColor} sessionId={item.id} />
				<Text className="text-sm font-medium mb-[20px] mt-[5px]" style={{ color: '#00000099' }}>
					{displayInfo.primaryName.split(' ')[0]}
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
							if (!item.otherUser || !currentUser) return null;

							const displayInfo = getSessionDisplayInfo(item, currentUser);

							return (
								<TouchableOpacity
									key={item.id}
									onPress={() => onSessionPress(item)}
									className="items-center mr-6"
								>
									<AvatarWithUnread uri={displayInfo.primaryPhoto} borderColor={borderColor} sessionId={item.id} />
									<Text className="text-sm font-medium mb-[20px] mt-[5px]" style={{ color: '#00000099' }}>
										{displayInfo.primaryName.split(' ')[0]}
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
