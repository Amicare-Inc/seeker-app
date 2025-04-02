// src/screens/PswSessionsTab.tsx
import React, { useEffect } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import SessionList from '@/components/SessionList';
import SessionModal from '@/components/SessionModal';
import { RootState, AppDispatch } from '@/redux/store';
import { selectEnrichedSessions } from '@/redux/selectors';
import { useSessionsTab } from '@/hooks/useSessionsTab';
import { EnrichedSession } from '@/types/EnrichedSession';
import { fetchUserById } from '@/redux/userSlice';
import SessionBookedList from '@/components/SessionBookedList';

const PswSessionsTab = () => {
	const {
		loading,
		error,
		expandedSession,
		handleExpandSession,
		handleCloseModal,
		handleAction,
	} = useSessionsTab('psw');

	// Get enriched sessions from the selector
	const dispatch: AppDispatch = useDispatch();
	const enrichedSessions = useSelector((state: RootState) =>
		selectEnrichedSessions(state),
	);
	const currentUserId = useSelector(
		(state: RootState) => state.user.userData?.id,
	);
	const userMap = useSelector((state: RootState) => state.user.allUsers);

	// Fetch missing user data if not already in userMap
	useEffect(() => {
		if (!currentUserId) return;
		enrichedSessions.forEach((session) => {
			let otherUserId: string | undefined;
			if (session.senderId === currentUserId) {
				otherUserId = session.receiverId;
			} else {
				otherUserId = session.senderId;
			}
			if (otherUserId && !userMap[otherUserId]) {
				console.log(`Fetching user data for ${otherUserId}`);
				dispatch(fetchUserById(otherUserId));
			}
		});
	}, [enrichedSessions, currentUserId, userMap, dispatch]);

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

	// Filter sessions by status
	const newRequestSessions = enrichedSessions.filter(
		(s: EnrichedSession) =>
			s.status === 'newRequest' && s.receiverId === currentUserId,
	);
	const pendingSessions = enrichedSessions.filter(
		(s) => s.status === 'pending',
	);
	const confirmedSessions = enrichedSessions.filter(
		(s) => s.status === 'confirmed',
	);

	// Callback for tapping a session
	const onSessionPress = (session: EnrichedSession) => {
		handleExpandSession(session);
	};

	return (
		<SafeAreaView className="flex-1" style={{ backgroundColor: '#f0f0f0' }}>
			{/* Header Row */}
			<View className="flex-row items-center px-3.5 pt-4 pb-2">
				<Ionicons
					name="time"
					size={24}
					color="black"
					style={{ marginRight: 8 }}
				/>
				<Text className="text-2xl font-mono text-black">Sessions</Text>
			</View>

			{/* Main Content */}
			<View className="flex-1 px-3.5">
				<SessionList
					sessions={newRequestSessions}
					onSessionPress={onSessionPress}
					title="New Requests"
				/>

				<SessionList
					sessions={pendingSessions}
					onSessionPress={onSessionPress}
					title="Pending"
				/>

				<SessionBookedList
					sessions={confirmedSessions}
					onSessionPress={onSessionPress}
					title="Confirmed"
				/>
			</View>

			<SessionModal
				onClose={handleCloseModal}
				isVisible={!!expandedSession}
				onAction={handleAction}
				user={expandedSession?.otherUser || null}
				isPending={
					expandedSession?.status === 'newRequest' ||
					expandedSession?.status === 'pending'
				}
				isConfirmed={expandedSession?.status === 'confirmed'}
			/>
		</SafeAreaView>
	);
};

export default PswSessionsTab;
