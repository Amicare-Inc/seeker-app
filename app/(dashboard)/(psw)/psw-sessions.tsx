// src/screens/PswSessionsTab.tsx
import React, { useEffect, useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, Keyboard, Platform, Animated, Easing } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import SessionList from '@/components/Session/SessionList';
import SessionModal from '@/components/Session/SessionModal';
import { RootState, AppDispatch } from '@/redux/store';
import { selectEnrichedSessions } from '@/redux/selectors';
import { useSessionsTab } from '@/hooks/useSessionsTab';
import { EnrichedSession } from '@/types/EnrichedSession';
import { fetchUserById } from '@/redux/userSlice';
import SessionBookedList from '@/components/Session/BookedSession/SessionBookedList';

import SessionCard from '@/components/Session/OngoingSession/SessionCard';

const PswSessionsTab = () => {
    const {
        loading,
        error,
        expandedSession,
        handleExpandSession,
        handleCloseModal,
        handleAction,
    } = useSessionsTab('psw');

    const dispatch: AppDispatch = useDispatch();
    const enrichedSessions = useSelector((state: RootState) =>
        selectEnrichedSessions(state),
    );
    const currentUserId = useSelector(
        (state: RootState) => state.user.userData?.id,
    );
    const userMap = useSelector((state: RootState) => state.user.allUsers);

    // Track keyboard height
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const insets = useSafeAreaInsets();

    // Animated value for keyboard height minus bottom inset
    const animatedKeyboardHeight = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const showSub = Keyboard.addListener('keyboardWillShow', (e) => {
            // Subtract the bottom inset so the card sits just above the keyboard
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

            {/* SessionCardChecklist always stays above the keyboard */}
            <Animated.View
                pointerEvents="box-none"
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: animatedKeyboardHeight, // No extra offset needed
                    zIndex: 100,
                }}
            >
                <SessionCard />
            </Animated.View>
        </SafeAreaView>
    );
};

export default PswSessionsTab;
