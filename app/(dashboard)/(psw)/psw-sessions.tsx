import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SessionList, SessionBookedList } from '@/features/sessions';
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
				isPsw: session.otherUser.isPsw
			});
		}
        dispatch(setActiveProfile(session.otherUser));
        setActiveEnrichedSession(session);
        router.push('/other-user-profile');

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

            {/* <ScrollView>
                <View className="flex-1 px-3.5 mb-[100px]">
                    <SessionList
                        sessions={[...confirmed, ...pending]}
                        onSessionPress={handleSessionPress}
                        title="pending"
                        isNewRequestsSection={false}
                    />
                </View>
            </ScrollView> */}
            {/* <View className="flex-row items-center px-[15px] border-b border-[#79797966] pb-4 mb-[10px]">
                <Ionicons
                    name="time"
                    size={26}
                    color="black"
                    style={{ marginRight: 8 }}
                />
                <Text className="text-xl text-black font-medium">New</Text>
            </View> */}

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