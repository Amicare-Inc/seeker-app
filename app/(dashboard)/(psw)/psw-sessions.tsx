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
	const { setActiveEnrichedSession } = useActiveSession(); // if inside same component
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
        
        dispatch(setActiveProfile(session.otherUser));
        setActiveEnrichedSession(session);
        
        // Check if this is a pending application (dimmed story circle)
        if (session.status === 'pending') {
            // Navigate to the application-sent page (grey expandable slider)
            const sessionData = {
                session: session,
                otherUser: session.otherUser,
                status: session.status,
                sessionId: session.id
            };
            
            router.push({
                pathname: '/application-sent',
                params: {
                    sessionData: JSON.stringify(sessionData)
                }
            });
        } else {
            // For confirmed, inProgress, or newRequest sessions, go to regular profile
            router.push('/other-user-profile');
        }

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
						// AppliedSessions header usage notes:
						// - AppliedSessions renders a horizontal avatar strip with the Amicare icon first,
						//   followed by the sessions passed via its `sessions` prop.
						// - Inside AppliedSessions:
						//   • Pending-like items (status 'pending' or 'newRequest') are dimmed (opacity 0.5) and never show the unread dot.
						//   • Ongoing items (status 'confirmed' or 'inProgress') can show the unread red dot.
						//   • Border color defaults to gray; when `isPending` is set, it uses #1A8BF8.
						//
						// To ensure ongoing sessions are also included in this top horizontal list,
						// pass a merged array that contains both applied/pending and ongoing items.
						//
						//   2) If useSessionsTab later returns an explicit `ongoing` array:
						//      <AppliedSessions sessions={[...pending, ...ongoing]} onSessionPress={handleSessionPress} />
						// AppliedSessions will handle unread-dot visibility and dimming per session.status automatically.
						ListHeaderComponent={
							<View style={{ marginTop: 12, marginBottom: 8 }}>
								<AppliedSessions
									sessions={[...pending, ...ongoingForHeader]}
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
			</View>
           
        </SafeAreaView>
    );
};

export default PswSessionsTab;