import React, { useEffect, useState } from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,

} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
	useLiveSession,
} from '@/features/sessions';
import { SessionList, SessionBookedList } from '@/features/sessions';
import { useSessionsTab } from '@/features/sessions';
import { EnrichedSession } from '@/types/EnrichedSession';
	import { NearbyPswMap } from '@/features/sessions/components';
import * as Location from 'expo-location';
import { useAvailableUsersWithDistance } from '@/features/userDirectory';
import { useAuth } from '@/features/auth'; // or however you get currentUserId
import { LAYOUT_CONSTANTS } from '@/shared/constants/layout';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import SeekerRequestCard from '@/features/sessions/components/RequestSession/SeekerRequestCard';
import { router } from 'expo-router';
import { setActiveProfile } from '@/redux/activeProfileSlice';
import { useActiveSession } from '@/lib/context/ActiveSessionContext';
import PendingSessions from '@/features/sessions/components/PendingSessions';


const SeekerSessionsTab = () => {
	const { user } = useAuth(); // assuming you have a logged-in user
	const { data: users, isLoading: usersLoading, error: usersError } = useAvailableUsersWithDistance('psw', user?.id);
	const {
		newRequests,
		pending,
		confirmed,
		applied,
		loading: sessionsLoading,
		error: sessionsError,
		handleExpandSession,
		refetchEnrichedSessions,
		refetchNewRequests,
	} = useSessionsTab('seeker');

	const openSessions: EnrichedSession[] = React.useMemo(() => {
		const byId = new Map<string, EnrichedSession>();
		[...(applied || []), ...(newRequests || [])].forEach((s) => byId.set(s.id, s));
		return Array.from(byId.values());
	}, [applied, newRequests]);

	/**
	 * Refetch when this screen gains focus to always get latest applied + newRequests
	 */
	useFocusEffect(
		React.useCallback(() => {
			refetchEnrichedSessions();
			refetchNewRequests();
		}, [refetchEnrichedSessions, refetchNewRequests]),
	);

	const activeLiveSession = useLiveSession();
	const dispatch = useDispatch();
	const { setActiveEnrichedSession } = useActiveSession();
	const currentUser = useSelector((state: RootState) => state.user.userData);

	const [markerCoords, setMarkerCoords] = useState<Record<string, { latitude: number; longitude: number }>>({});
		const [showMap, setShowMap] = useState(true);

	const initialRegion = {
		latitude: 43.6532,
		longitude: -79.3832,
		latitudeDelta: 0.1,
		longitudeDelta: 0.1,
	};

	useEffect(() => {
		let isCancelled = false;
		const geocodeAll = async () => {
			if (!users || users.length === 0) {
				setMarkerCoords({});
				return;
			}
			const results = await Promise.all(
				users.map(async (u: any) => {
					try {
						const addr =
							u?.address?.fullAddress ||
							[
								u?.address?.street,
								u?.address?.city,
								u?.address?.province,
								u?.address?.postalCode,
								u?.address?.country,
							]
								.filter(Boolean)
								.join(', ');
						if (!addr) return null;
						const geos = await Location.geocodeAsync(addr);
						if (geos && geos[0]) {
							return [u.id, { latitude: geos[0].latitude, longitude: geos[0].longitude }] as const;
						}
					} catch (e) {
						// ignore individual failures
					}
					return null;
				}),
			);
			if (isCancelled) return;
			const mapped: Record<string, { latitude: number; longitude: number }> = {};
			for (const item of results) {
				if (item) {
					const [id, coord] = item;
					mapped[id] = coord;
				}
			}
			setMarkerCoords(mapped);
		};
		geocodeAll();
		return () => {
			isCancelled = true;
		};
	}, [users]);

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

	const loading = usersLoading || sessionsLoading;
	if (loading) {
		return (
			<SafeAreaView className="flex-1 items-center justify-center bg-white">
				<Text>Loading...</Text>
			</SafeAreaView>
		);
	}

	if (usersError || sessionsError) {
		return (
			<SafeAreaView className="flex-1 items-center justify-center bg-white">
				<Text>
					{usersError
						? `Error loading users: ${usersError}`
						: `Error loading sessions: ${sessionsError}`}
				</Text>
			</SafeAreaView>
		);
	}
	
	const onSessionPress = (session: EnrichedSession) => {
		handleExpandSession(session);
	};
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

	const handleSessionPress = (session: EnrichedSession) => {

		dispatch(setActiveProfile(session.otherUser as any));
		setActiveEnrichedSession(session);
		// Check if this is a pending application (dimmed story circle)
		if (session.status === 'pending') {
			router.push('/other-user-profile');
		}
	};


	return (
		<SafeAreaView
			className="flex-1"
			style={{
				backgroundColor: '#F2F2F7',
				paddingTop: LAYOUT_CONSTANTS.SCREEN_TOP_PADDING,
			}}
		>
			
			<View className="flex-row items-center justify-between px-[15px] border-b border-[#79797966] pb-4 mb-[10px]">
			<Text className="text-xl text-black font-medium">Nearby PSWs</Text>
				{showMap ? (
					<TouchableOpacity onPress={() => setShowMap(false)} className="px-2 py-1">
						<Text className="text-black">Hide</Text>
					</TouchableOpacity>
				) : (
					<TouchableOpacity
						onPress={() => setShowMap(true)}
						className="bg-[#E5E5EA] px-3 py-1 rounded-xl"
					>
						<Text className="text-black">Map</Text>
					</TouchableOpacity>
				)}
			</View>
			{showMap && (
				<View style={{ flex: 1 }}>
					<NearbyPswMap
						users={users as any}
						markerCoords={markerCoords}
						initialRegion={initialRegion as any}
						style={{ flex: 2 }}
					/>
					<View className="bg-white px-6 pt-4 pb-8 justify-start" style={{ flex: 1 }}>
						<Text className="text-center text-black text-3xl font-semibold">
							Connect with over
						</Text>
						<Text className="text-center text-black text-3xl font-semibold mt-1">
							500 caregivers
						</Text>
						<Text className="text-center text-black text-3xl font-semibold mt-1">
							in your area
						</Text>
						<View className="items-center mt-2">
							<TouchableOpacity
								onPress={handleRequestSession}
								className="bg-brand-blue rounded-full px-5 py-4"
								style={{
									shadowColor: '#000',
									shadowOffset: { width: 0, height: 2 },
									shadowOpacity: 0.25,
									shadowRadius: 3.84,
									elevation: 5,
								}}
							>
								<View className="flex-row items-center">
									<Ionicons name="add" size={28} color="white" style={{ marginRight: 8 }} />
									<Text className="text-white text-lg font-medium mr-3">Request Session</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			)}
			{!showMap && (
				<>
					<ScrollView
						contentContainerStyle={{
							paddingBottom:
								LAYOUT_CONSTANTS.getContentBottomPadding(
									!!activeLiveSession,
								),
						}}
					>
					<View className="flex-row items-center px-[15px] border-b border-[#79797966] pb-4 mb-[10px] mt-[10px]">
					
						
					<Text className="text-xl text-black font-medium">
						New
					</Text>
					</View>
						<View className="flex-1 px-3.5">
							{openSessions.length > 0 ? (
								openSessions.map((session) => (
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

					<View style={{ marginTop: 12, marginBottom: 8 }}>
					
					</View>
					<View style={{ marginTop: 12, marginBottom: 8 }}>
						<PendingSessions
							sessions={pending}
							onSessionPress={handleSessionPress}
							title="Applied"
						/>
					</View>

					<SessionBookedList
						sessions={confirmed}
						onSessionPress={onSessionPress}
						title="Booked"
					/>
				<TouchableOpacity
					onPress={handleRequestSession}
					className="bg-white rounded-full px-5 py-3 self-center border border-[#E5E5EA] mt-4 mb-6"
				>
					<View className="flex-row items-center">
						<Ionicons name="add" size={18} color="#111827" style={{ marginRight: 8 }}/>
						<Text className="text-black text-base font-medium mr-4">Request Session</Text>
					</View>
				</TouchableOpacity>
						
						
					</ScrollView>
				</>
			)}
	

			
		</SafeAreaView>
	);
};

export default SeekerSessionsTab;

