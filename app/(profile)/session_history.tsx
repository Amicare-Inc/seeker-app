import React, { useCallback, useMemo } from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Image,
	ActivityIndicator,
	RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { setActiveProfile } from '@/redux/activeProfileSlice';
import { useEnrichedSessions } from '@/features/sessions/api/queries';
import { useActiveSession } from '@/lib/context/ActiveSessionContext';
import { EnrichedSession } from '@/types/EnrichedSession';
import {
	filterHistorySessions,
	sortSessionsNewestFirst,
	formatHistoryDateTime,
	formatHistoryPrice,
	historyDisplayName,
} from '@/features/sessions/utils/sessionHistory';

const SessionHistory = () => {
	const userId = useSelector((s: RootState) => s.user.userData?.id);
	const dispatch = useDispatch();
	const { setActiveEnrichedSession } = useActiveSession();

	const {
		data: allSessions = [],
		isLoading,
		isRefetching,
		error,
		refetch,
	} = useEnrichedSessions(userId);

	const historySessions = useMemo(() => {
		return sortSessionsNewestFirst(filterHistorySessions(allSessions));
	}, [allSessions]);

	const onRefresh = useCallback(() => {
		refetch();
	}, [refetch]);

	const onRowPress = useCallback(
		(session: EnrichedSession) => {
			setActiveEnrichedSession(session);
			if (session.otherUser) {
				dispatch(setActiveProfile(session.otherUser));
			}
			router.push({
				pathname: '/(chat)/[sessionId]',
				params: { sessionId: session.id },
			});
		},
		[dispatch, setActiveEnrichedSession],
	);

	return (
		<SafeAreaView className="flex-1 bg-[#F7F7F7]">
			<View className="flex-row items-center px-4 py-3">
				<TouchableOpacity onPress={() => router.back()} className="mr-4">
					<Ionicons name="chevron-back" size={24} color="black" />
				</TouchableOpacity>
				<Text className="text-xl font-medium">Session history</Text>
			</View>

			{isLoading && !allSessions.length ? (
				<View className="flex-1 items-center justify-center py-20">
					<ActivityIndicator size="large" color="#000" />
					<Text className="text-gray-500 mt-3">Loading sessions…</Text>
				</View>
			) : error ? (
				<View className="flex-1 items-center justify-center px-6">
					<Text className="text-center text-gray-700 mb-3">
						Couldn't load session history.
					</Text>
					<TouchableOpacity
						onPress={() => refetch()}
						className="bg-black px-5 py-2 rounded-lg"
					>
						<Text className="text-white font-medium">Try again</Text>
					</TouchableOpacity>
				</View>
			) : (
				<ScrollView
					className="flex-1"
					refreshControl={
						<RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
					}
				>
					<View className="bg-white rounded-xl mx-4 mt-2 mb-4">
						{historySessions.length === 0 ? (
							<View className="px-4 py-10 items-center">
								<Text className="text-gray-500 text-center">
									No sessions yet. Booked, upcoming, and past sessions will
									appear here.
								</Text>
							</View>
						) : (
							historySessions.map((session) => {
								const when = formatHistoryDateTime(
									session.startTime || session.endTime,
								);
								const name = historyDisplayName(session);
								const price = formatHistoryPrice(session);
								const photo = session.otherUser?.profilePhotoUrl;
								const isDisabledRow =
									session.status === 'cancelled' ||
									session.status === 'rejected';

								return (
									<TouchableOpacity
										key={session.id}
										onPress={isDisabledRow ? undefined : () => onRowPress(session)}
										disabled={isDisabledRow}
										activeOpacity={isDisabledRow ? 1 : 0.7}
										className={`flex-row items-center px-4 py-3 border-b border-gray-100 ${
											isDisabledRow ? 'opacity-50' : ''
										}`}
									>
										<Image
											source={
												photo
													? { uri: photo }
													: require('@/assets/default-profile.png')
											}
											className="w-10 h-10 rounded-full mr-3"
										/>
										<View className="flex-1">
											<Text className="font-medium text-base">{name}</Text>
											<Text className="text-xs text-gray-500">
												{when.date}
												{when.time ? ` · ${when.time}` : ''}
											</Text>
											<Text className="text-[10px] text-gray-400 mt-0.5 capitalize">
												{session.status?.replace(/([A-Z])/g, ' $1').trim()}
											</Text>
										</View>
										<Text className="font-medium text-base">{price}</Text>
										{!isDisabledRow && (
											<Ionicons
												name="chevron-forward"
												size={18}
												color="#bfbfc3"
												style={{ marginLeft: 8 }}
											/>
										)}
									</TouchableOpacity>
								);
							})
						)}
					</View>
				</ScrollView>
			)}
		</SafeAreaView>
	);
};

export default SessionHistory;
