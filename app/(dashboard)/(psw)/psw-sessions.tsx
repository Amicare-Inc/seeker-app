import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import SessionList from '@/components/Session/SessionList';
import { useSessionsTab } from '@/hooks/useSessionsTab';
import { EnrichedSession } from '@/types/EnrichedSession';
import SessionBookedList from '@/components/Session/BookedSession/SessionBookedList';
import SessionCardChecklist from '@/components/Session/OngoingSession/SessionCardChecklist';

const PswSessionsTab = () => {
    const {
        newRequests,
        pending,
        confirmed,
        loading,
        error,
        handleExpandSession,
    } = useSessionsTab('psw');

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
            style={{ backgroundColor: '#f0f0f0' }}
        >
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

            {/* SessionCardChecklist */}
            <View
                pointerEvents="box-none"
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 100,
                }}
            >
                <SessionCardChecklist />
            </View>
        </SafeAreaView>
    );
}
export default PswSessionsTab;
