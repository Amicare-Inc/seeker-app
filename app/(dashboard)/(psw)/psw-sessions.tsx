import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SessionList, SessionBookedList } from '@/features/sessions';
import AppliedSessions from '@/features/sessions/components/AppliedSessions';
import { useSessionsTab } from '@/features/sessions';
import { EnrichedSession } from '@/types/EnrichedSession';
import { BlurView } from 'expo-blur';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveProfile } from '@/redux/activeProfileSlice';
import RequestSessionCard from '@/features/sessions/components/RequestSession/SessionsCard';
import { RootState } from '@/redux/store';
import { router, useFocusEffect } from 'expo-router';
import { ActivityIndicator, FlatList, Platform } from 'react-native';
import { useActiveSession } from '@/lib/context/ActiveSessionContext';
const PswSessionsTab = () => {
    const dispatch = useDispatch();
	const {
		newRequests,
		pending,
        // rejected,
		confirmed,
		loading,
		error,
		applied,
		handleExpandSession,
	} = useSessionsTab('psw');

	// Include ongoing sessions in the horizontal header by merging with pending.
	// We consider sessions with status 'confirmed' or 'inProgress' as ongoing for display purposes.
	const ongoingForHeader = React.useMemo(
		() => confirmed.filter((s) => s.status === 'confirmed' || s.status === 'inProgress'),
		[confirmed]
	);

	// Hooks must be called before any early returns
	const currentUser = useSelector((state: RootState) => state.user.userData);
	const isVerified = currentUser?.idManualVerified ?? false;
	const { setActiveEnrichedSession } = useActiveSession(); // keep hook order consistent

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
    const handleSessionPress = (session: EnrichedSession) => {
        if (!isVerified) return; //prevent interaction when not verified
        if (!session.otherUser) return;
        		// Debug: Log what family member is being clicked
		if (session.otherUser.isFamilyMemberCard && session.otherUser.familyMemberInfo) {
			console.log('🔍 Family member card clicked:', {
				coreUserId: session.otherUser.id,
				familyMemberId: session.otherUser.familyMemberInfo.id,
				familyMemberName: `${session.otherUser.familyMemberInfo.firstName} ${session.otherUser.familyMemberInfo.lastName}`,
				coreUserName: `${session.otherUser.firstName} ${session.otherUser.lastName}`
			});
		} else {
			console.log('🔍 Regular user card clicked:', {
				userId: session.otherUser.id,
				userName: `${session.otherUser.firstName} ${session.otherUser.lastName}`,
				isPsw: session.otherUser.isPsw,
				sessionStatus: session.status
			});
		}
		        
        const shouldOpenMessages =
			session.status === 'confirmed' || session.status === 'inProgress';

        dispatch(setActiveProfile(session.otherUser));
        setActiveEnrichedSession(session);
        
        // Check if this is a pending application (dimmed story circle)
        if (shouldOpenMessages) {
                  router.push({
                pathname: '/(chat)/chatPage',
                params: { sessionId: session.id },
            });
        } else {
            router.push('/other-user-profile');
        }
    };
	
    // Trigger expand interaction for booked/confirmed sessions list
    const onSessionPress = (session: EnrichedSession) => {
        handleExpandSession(session);
    };
	
    const renderItem = ({item}: {item: EnrichedSession}) => (
        <RequestSessionCard
            session={item}
            familyMember={item.isForFamilyMember ? item.otherUser?.familyMemberInfo : undefined}
            distanceInfo={item.distanceInfo}
            onPress={() => handleSessionPress(item)}
        />
    );
    return (
        <SafeAreaView
            className="flex-1"
            style={{ backgroundColor: '#F2F2F7' }}
        >
            <View className="flex-1 relative">
				{/* Main content */}
				{ loading ? (
					<View className="flex-1 items-center justify-center">
						<ActivityIndicator size="large" color="#000" />
					</View>
				) : error ? (
					<View className="flex-1 items-center justify-center">
						<Text className="text-black">Error: {error || 'Something went wrong'}</Text>
					</View>
				) : (
					<FlatList
						data={newRequests}
						keyExtractor={(item) => item.id}
						renderItem={renderItem}
						
						ListHeaderComponent={
							<View style={{ marginTop: 12, marginBottom: 8 }}>
								<AppliedSessions
									sessions={[...pending, ...applied, ...ongoingForHeader]}
									onSessionPress={handleSessionPress}
									title="Applied"
								/>
							</View>
						}
						contentContainerStyle={{
							paddingBottom: Platform.OS === 'ios' ? 83 : 64,
							paddingHorizontal: 20,
						}}
						scrollEnabled={isVerified}
						pointerEvents={isVerified ? 'auto' : 'none'}
					/>
				)}

				{/* Blur overlay when not verified */}
				{!isVerified && (
					<BlurView
						tint="light"
						intensity={15}
						experimentalBlurMethod="dimezisBlurView"
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							zIndex: 10,
						}}
					/>
				)}
				{!currentUser?.isPsw && (
					<SessionBookedList
						sessions={confirmed}
						onSessionPress={onSessionPress}
						title="Confirmed"
					/>
				)}
			</View>
           
        </SafeAreaView>
    );
};

export default PswSessionsTab;
