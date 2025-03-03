// src/screens/SeekerSessionsTab.tsx
import React, { useEffect } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import SessionList from '@/components/SessionList';
import SessionModal from '@/components/SessionModal';
import { RootState, AppDispatch } from '@/redux/store';
import { selectEnrichedSessions } from '@/redux/selectors';
import { useSessionsTab } from '@/hooks/useSessionsTab';
import { EnrichedSession } from '@/types/EnrichedSession';
import { fetchUserById } from '@/redux/userSlice';
import SessionBookedList from '@/components/SessionBookedList';

const SeekerSessionsTab = () => {
  const dispatch: AppDispatch = useDispatch();
  const {
    loading,
    error,
    expandedSession,
    handleExpandSession,
    handleCloseModal,
    handleAction,
  } = useSessionsTab('seeker'); // <-- Use 'seeker' role here

  // Get enriched sessions from the selector
  const enrichedSessions = useSelector((state: RootState) => selectEnrichedSessions(state));
  const currentUserId = useSelector((state: RootState) => state.user.userData?.id);
  const userMap = useSelector((state: RootState) => state.user.allUsers);
  console.log('Enriched sessions in SeekerSessionsTab:', enrichedSessions);

  // For each enriched session, if the otherUser is missing, fetch it.
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
        console.log(`Fetching user data for ${otherUserId}`);
        dispatch(fetchUserById(otherUserId));
      }
    });
  }, [enrichedSessions, currentUserId, userMap, dispatch]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text>Loading sessions...</Text>
      </SafeAreaView>
    );
  }
  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
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

  // Single-argument callback: pass the enriched session to the handler.
  const onSessionPress = (session: EnrichedSession) => {
    handleExpandSession(session);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-4">
        <Text className="text-2xl font-bold text-black mb-4">Sessions</Text>

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
        // Pass the otherUser from the enriched session
        user={expandedSession?.otherUser || null}
        isPending={expandedSession?.status === 'newRequest' || expandedSession?.status === 'pending'}
        isConfirmed={expandedSession?.status === 'confirmed'}
      />
    </SafeAreaView>
  );
};

export default SeekerSessionsTab;