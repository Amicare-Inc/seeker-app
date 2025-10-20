import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SessionList, SessionBookedList, useLiveSession } from '@/features/sessions';
import { useSessionsTab } from '@/features/sessions';
import { EnrichedSession } from '@/types/EnrichedSession';
import { LAYOUT_CONSTANTS } from '@/shared/constants/layout';

const PswSessionsTab = () => {
	const {
		newRequests,
		pending,
		confirmed,
		loading,
		error,
		handleExpandSession,
	} = useSessionsTab('psw');
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

            <ScrollView 
                contentContainerStyle={{
                    paddingBottom: LAYOUT_CONSTANTS.getContentBottomPadding(!!activeLiveSession)
                }}
            >
                <View className="flex-1 px-3.5">
                    <SessionList
                        sessions={newRequests}
                        onSessionPress={onSessionPress}
                        isNewRequestsSection={true}
                    />

                    <SessionList
                        sessions={pending}
                        onSessionPress={onSessionPress}
                        title="Pending"
                    />

                    <SessionBookedList
                        sessions={confirmed}
                        onSessionPress={onSessionPress}
                        title="Booked"
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default PswSessionsTab;
