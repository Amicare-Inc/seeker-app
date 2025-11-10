import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
	useLiveSession,
} from '@/features/sessions';
import { SessionList, SessionBookedList } from '@/features/sessions';
import { useSessionsTab } from '@/features/sessions';
import { EnrichedSession } from '@/types/EnrichedSession';
import { LAYOUT_CONSTANTS } from '@/shared/constants/layout';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import SeekerRequestCard from '@/features/sessions/components/RequestSession/SeekerRequestCard';
import { router } from 'expo-router';
import { setActiveProfile } from '@/redux/activeProfileSlice';
import { useActiveSession } from '@/lib/context/ActiveSessionContext';


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
	const dispatch = useDispatch();
	const { setActiveEnrichedSession } = useActiveSession();
	const currentUser = useSelector((state: RootState) => state.user.userData);

	// Debug logging
	console.log('pending', pending.map((session) => session.id));
	console.log('newRequests', newRequests.map((session) => session.id));
	console.log('confirmed', confirmed.map((session) => session.id));
	console.log('🔍 [Sessions Debug]', {
		newRequestsCount: newRequests.length,
		pendingCount: pending.length,
		confirmedCount: confirmed.length,
		currentUser: currentUser?.firstName,
	});

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
	// console.log('newRequests', newRequests);
	const handleRequestSession = () => {
		router.push({
			pathname: '/request-sessions'
		});
	};
	const handleSelectPSW = async (pswId: string, pswData: any, session: EnrichedSession) => {
		
		const selectedId = pswId; // explicitly use applicant.id passed from SeekerRequestCard
		console.log('selectedId', selectedId);
		dispatch(setActiveProfile({ ...pswData, id: selectedId } as any));
		
		setActiveEnrichedSession(session);
		router.push({ pathname: '/other-user-profile', params: { selectedId } });
	};

	return (
		<SafeAreaView
			className="flex-1"
			style={{
				backgroundColor: '#F2F2F7',
				paddingTop: LAYOUT_CONSTANTS.SCREEN_TOP_PADDING,
			}}
		>
			<View className="flex-row items-center px-[15px] border-b border-[#79797966] pb-4 mb-[10px]">
				<Ionicons
					name="time"
					size={26}
					color="black"
					style={{ marginRight: 8 }}
				/>
				<Text className="text-xl text-black font-medium">
					My Sessions
				</Text>
			</View>

			<ScrollView
				contentContainerStyle={{
					paddingBottom:
						LAYOUT_CONSTANTS.getContentBottomPadding(
							!!activeLiveSession,
						),
				}}
			>
				<View className="flex-1 px-3.5">
					{newRequests.length > 0 ? (
						newRequests.map((session) => (

	
							<SeekerRequestCard
								key={session.id}
								session={session}
								onSelectPSW={(pswId, applicant) =>
									handleSelectPSW(pswId, applicant, session)
								}
							/>
						))
					) : (
						<View className="items-center mt-6">
							<Text className="text-gray-600">No new requests yet.</Text>
						</View>
					)}

				</View>
				{!currentUser?.isPsw && (
					<SessionBookedList
						sessions={confirmed}
						onSessionPress={onSessionPress}
						title="Confirmed"
					/>
				)}
			</ScrollView>
			<TouchableOpacity
				onPress={handleRequestSession}
				className="bg-brand-blue rounded-full p-4 absolute right-6"
				style={{
					bottom: LAYOUT_CONSTANTS.TAB_BAR_HEIGHT + (activeLiveSession ? 60 : 0) + 16,
					shadowColor: "#000",
					shadowOffset: {width: 0, height: 2},
					shadowOpacity: 0.25,
					shadowRadius: 3.84,
					elevation: 5,
				}}
			>
				
				<View className="flex-row items-center">
					<Ionicons name="add" size={28} color="white" style={{ marginRight: 8 }}/>
					<Text className="text-white text-lg font-medium mr-3">Request Session</Text>
				</View>
			</TouchableOpacity>

			
		</SafeAreaView>
	);
};

export default SeekerSessionsTab;
