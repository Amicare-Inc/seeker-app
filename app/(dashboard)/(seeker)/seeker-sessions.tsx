import React, { useEffect, useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, Keyboard, Platform, Animated, Easing } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import SessionList from '@/components/SessionList';
import SessionBookedList from '@/components/SessionBookedList';
import { useSessionsTab } from '@/hooks/useSessionsTab';
import { EnrichedSession } from '@/types/EnrichedSession';
import LiveSessionCard from '@/components/LiveSessionCard';

const SeekerSessionsTab = () => {
	const {
		newRequests,
		pending,
		confirmed,
		loading,
		error,
		handleExpandSession,
	} = useSessionsTab('seeker');

	const [keyboardHeight, setKeyboardHeight] = useState(0);
	const insets = useSafeAreaInsets();
	const animatedKeyboardHeight = React.useRef(new Animated.Value(0)).current;

	// Find the active session (first confirmed session that's within 2 hours of start time)
	const activeSession = confirmed?.find(session => {
		if (!session.startTime) return false;
		const startTime = new Date(session.startTime);
		const now = new Date();
		const timeDiff = startTime.getTime() - now.getTime();
		const hoursDiff = timeDiff / (1000 * 60 * 60);
		return hoursDiff <= 2 && hoursDiff > -24; // Show for sessions starting within 2 hours or ongoing (up to 24 hours after start)
	});

	useEffect(() => {
		const showSub = Keyboard.addListener('keyboardWillShow', (e) => {
			const height = Math.max(0, e.endCoordinates.height - insets.bottom);
			Animated.timing(animatedKeyboardHeight, {
				toValue: height,
				duration: e.duration || 250,
				easing: Easing.out(Easing.ease),
				useNativeDriver: false,
			}).start();
		});
		const hideSub = Keyboard.addListener('keyboardWillHide', (e) => {
			Animated.timing(animatedKeyboardHeight, {
				toValue: 0,
				duration: e?.duration || 250,
				easing: Easing.out(Easing.ease),
				useNativeDriver: false,
			}).start();
		});
		return () => {
			showSub.remove();
			hideSub.remove();
		};
	}, [animatedKeyboardHeight, insets.bottom]);

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
		<SafeAreaView className="flex-1" style={{ backgroundColor: '#f0f0f0' }}>
			{/* Header Row */}
			<View className="flex-row items-center px-3.5 pb-2">
				<Ionicons
					name="time"
					size={24}
					color="black"
					style={{ marginRight: 8 }}
				/>
				<Text className="text-2xl text-black">Sessions</Text>
			</View>

			{/* Main Content */}
			<View className="flex-1 px-3.5">
				<SessionList
					sessions={newRequests}
					onSessionPress={onSessionPress}
					title="New Requests"
				/>

				<SessionList
					sessions={pending}
					onSessionPress={onSessionPress}
					title="Pending"
				/>

				<SessionBookedList
					sessions={confirmed}
					onSessionPress={onSessionPress}
					title="Confirmed"
				/>
			</View>

			{/* LiveSessionCard */}
			{activeSession && (
				<Animated.View
					pointerEvents="box-none"
					style={{
						position: 'absolute',
						left: 0,
						right: 0,
						bottom: animatedKeyboardHeight,
						zIndex: 100,
					}}
				>
					<LiveSessionCard
						session={activeSession}
						onExpand={() => console.log('expanded')}
						onCollapse={() => console.log('collapsed')}
					/>
				</Animated.View>
			)}
		</SafeAreaView>
	);
};

export default SeekerSessionsTab;
