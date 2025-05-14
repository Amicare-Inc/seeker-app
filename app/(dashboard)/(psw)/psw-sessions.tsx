// src/screens/PswSessionsTab.tsx
import React, { useEffect } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import SessionList from '@/components/SessionList';
import SessionModal from '@/components/SessionModal';
import { RootState, AppDispatch } from '@/redux/store';
import { useSessionsTab } from '@/hooks/useSessionsTab'; // Import useSessionsTab
import { EnrichedSession } from '@/types/EnrichedSession';
import SessionBookedList from '@/components/SessionBookedList';

const PswSessionsTab = () => {
	const {
		newRequests, // Get newRequests from the hook
		pending, // Get pending from the hook
		confirmed, // Get confirmed from the hook
		loading,
		error,
		expandedSession,
		handleExpandSession,
		handleCloseModal,
		handleAction,
	} = useSessionsTab('psw'); // Use the hook

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

	// *** Removed local filtering logic ***

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
					sessions={newRequests} // Use newRequests from the hook
					onSessionPress={onSessionPress}
					title="New Requests"
				/>

				<SessionList
					sessions={pending} // Use pending from the hook
					onSessionPress={onSessionPress}
					title="Pending"
				/>

				<SessionBookedList
					sessions={confirmed} // Use confirmed from the hook
					onSessionPress={onSessionPress}
					title="Confirmed"
				/>

				{/* Add other SessionList components for other statuses if needed */}
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
