import React, { useEffect } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import SessionList from '@/components/SessionList';
import SessionBookedList from '@/components/SessionBookedList';
import SessionModal from '@/components/SessionModal';
import { RootState, AppDispatch } from '@/redux/store';
import { selectEnrichedSessions } from '@/redux/selectors';
import { useSessionsTab } from '@/hooks/useSessionsTab';
import { EnrichedSession } from '@/types/EnrichedSession';
import { fetchUserById } from '@/redux/userSlice';

const SeekerSessionsTab = () => {
  const dispatch: AppDispatch = useDispatch();
  const {
    loading,
    error,
    expandedSession,
    handleExpandSession,
    handleCloseModal,
    handleAction,
  } = useSessionsTab('seeker');

  const enrichedSessions = useSelector((state: RootState) => selectEnrichedSessions(state));
  const currentUserId = useSelector((state: RootState) => state.user.userData?.id);
  const userMap = useSelector((state: RootState) => state.user.allUsers);

  // Fetch missing user data
  useEffect(() => {
    if (!currentUserId) return;
    enrichedSessions.forEach(session => {
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
        <Text>Loading sessions...</Text>
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

  // Filter sessions by status
  const newRequestSessions = enrichedSessions.filter(
    (s: EnrichedSession) => s.status === 'newRequest' && s.receiverId === currentUserId
  );
  const pendingSessions = enrichedSessions.filter((s: EnrichedSession) => s.status === 'pending');
  const confirmedSessions = enrichedSessions.filter((s: EnrichedSession) => s.status === 'confirmed');

  // Single-argument callback
  const onSessionPress = (session: EnrichedSession) => {
    handleExpandSession(session);
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#f0f0f0" }}>
      {/* Header Row */}
      <View className="flex-row items-center px-3.5 pt-4 pb-2">
        <Ionicons name="time" size={24} color="black" style={{ marginRight: 8 }} />
        <Text className="text-2xl font-mono text-black">Sessions</Text>
      </View>

      {/* Categories */}
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

      {/* Session Modal */}
      <SessionModal
        onClose={handleCloseModal}
        isVisible={!!expandedSession}
        onAction={handleAction}
        user={expandedSession?.otherUser || null}
        isPending={expandedSession?.status === 'newRequest' || expandedSession?.status === 'pending'}
        isConfirmed={expandedSession?.status === 'confirmed'}
      />
    </SafeAreaView>
  );
};

export default SeekerSessionsTab;