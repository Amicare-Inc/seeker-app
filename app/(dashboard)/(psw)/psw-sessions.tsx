// src/screens/PswSessionsTab.tsx
import React, { useEffect } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import SessionList from '@/components/SessionList';
import SessionModal from '@/components/SessionModal';
import { RootState, AppDispatch } from '@/redux/store';
import { selectEnrichedSessions } from '@/redux/selectors';
import { useSessionsTab } from '@/hooks/useSessionsTab';
import { EnrichedSession } from '@/types/EnrichedSession';
import { fetchUserById } from '@/redux/userSlice';
import SessionBookedList from '@/components/SessionBookedList';

const PswSessionsTab = () => {
  const {
    loading,
    error,
    expandedSession,
    handleExpandSession,
    handleCloseModal,
    handleAction,
  } = useSessionsTab('psw');

  // Get enriched sessions from the selector
  const dispatch: AppDispatch = useDispatch();
  const enrichedSessions = useSelector((state: RootState) => selectEnrichedSessions(state));
  const currentUserId = useSelector((state: RootState) => state.user.userData?.id);
  const userMap = useSelector((state: RootState) => state.user.allUsers);
  console.log('Enriched sessions in PSWSessionsTab:', enrichedSessions);

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
        <Text>Loading...</Text>
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

  // Filter each category from enrichedSessions
  const newRequestSessions = enrichedSessions.filter(
    (s: EnrichedSession) => s.status === 'newRequest' && s.receiverId === currentUserId
  );
  const pendingSessions = enrichedSessions.filter(s => s.status === 'pending');
  const confirmedSessions = enrichedSessions.filter(s => s.status === 'confirmed');

  // Single-argument callback
  const onSessionPress = (session: EnrichedSession) => {
    // We can call handleExpandSession, but note handleExpandSession expects a base Session
    // We can pass the same session because EnrichedSession extends Session
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
        // If expandedSession is an EnrichedSession, you could pass expandedSession.otherUser
        user={expandedSession?.otherUser || null}
        isPending={
          expandedSession?.status === 'newRequest' ||
          expandedSession?.status === 'pending'
        }
        isConfirmed={expandedSession?.status === 'confirmed'}
      />
    </SafeAreaView>
  );
};

export default PswSessionsTab;