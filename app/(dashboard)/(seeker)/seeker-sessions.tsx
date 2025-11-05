import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, FlatList } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLiveSession } from '@/features/sessions';
import { useSessionsTab } from '@/features/sessions';
import { EnrichedSession } from '@/types/EnrichedSession';
import { LAYOUT_CONSTANTS } from '@/shared/constants/layout';
import SeekerRequestCard from '@/features/sessions/components/RequestSession/SeekerRequestCard';

const SeekerSessionsTab = () => {
	const {
		newRequests,
		pending,
		confirmed,
		loading,
		error,
		handleExpandSession,
	} = useSessionsTab('seeker');
	const activeLiveSession = useLiveSession();

	if (loading) {
		return (
			<SafeAreaView className="flex-1 items-center justify-center bg-white">
				<Text>Loading...</Text>
			</SafeAreaView>
		);
	}

	if (error) {
		return (
			<SafeAreaView className="flex-1 items-center justify-center bg-white">
				<Text>Error fetching sessions: {error}</Text>
			</SafeAreaView>
		);
	}

	const onSessionPress = (session: EnrichedSession) => {
		handleExpandSession(session);
	};

	return (
		<SafeAreaView
			className="flex-1"
			style={{ 
				backgroundColor: '#F2F2F7',
				paddingTop: LAYOUT_CONSTANTS.SCREEN_TOP_PADDING
			}}
		>
			<View className="flex-row items-center px-[15px] border-b border-[#79797966] pb-4 mb-[10px]">
				<Ionicons
					name="time"
					size={26}
					color="black"
					style={{ marginRight: 8 }}
				/>
				<Text className="text-xl text-black font-medium">My Sessions</Text>
			</View>

			<View className="flex-1 px-3.5">
				<FlatList
					data={newRequests}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<SeekerRequestCard
							session={item}
							onPress={() => onSessionPress(item)}
						/>
					)}
					ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
					contentContainerStyle={{
						paddingBottom: LAYOUT_CONSTANTS.getContentBottomPadding(!!activeLiveSession),
					}}
					ListEmptyComponent={(
						<View className="items-center mt-6">
							<Text className="text-gray-600">No new requests yet.</Text>
						</View>
					)}
				/>
			</View>
		</SafeAreaView>
	);
};

export default SeekerSessionsTab;
