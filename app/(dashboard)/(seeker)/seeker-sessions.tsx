import React from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import SessionList from '@/components/SessionList';
import SessionModal from '@/components/SessionModal';
import SessionBookedList from '@/components/SessionBookedList';

// Import the custom hook
import { useSessionsTab } from '@/hooks/useSessionsTab';

const SeekerSessionsTab = () => {
  // Pass the role param to the hook. 
  // We can do role="seeker" so you can add custom logic if needed later.
  const {
    notConfirmedSessions,
    confirmedSessions,
    bookedSessions,
    pendingMap,
    acceptedMap,
    bookedMap,
    loading,
    error,
    expandedSession,
    handleExpandSession,
    handleCloseModal,
    handleAction,
    getUserForExpandedSession,
  } = useSessionsTab('seeker');

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

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-4">
        <Text className="text-2xl font-bold text-black mb-4">Sessions</Text>

        {/* Not Confirmed Yet */}
        <SessionList
          sessions={notConfirmedSessions}
          onSessionPress={handleExpandSession}
          requesterMap={pendingMap}
          title="Not Confirmed Yet"
        />

        {/* Confirmed/Upcoming */}
        <View className="mt-8">
          <SessionList
            sessions={confirmedSessions}
            onSessionPress={handleExpandSession}
            requesterMap={acceptedMap}
            title="Confirmed / Upcoming"
          />
        </View>

        {/* Booked */}
        <SessionBookedList
          sessions={bookedSessions}
          onSessionPress={handleExpandSession}
          requesterMap={bookedMap}
          title="Booked"
        />
      </View>

      {/* Modal for Expanded Session */}
      <SessionModal
        onClose={handleCloseModal}
        isVisible={!!expandedSession}
        onAction={handleAction}
        user={getUserForExpandedSession()}
        isConfirmed={expandedSession?.status === 'accepted'}
        isPending={expandedSession?.status === 'pending'}
        isBooked={expandedSession?.status === 'booked'}
      />
    </SafeAreaView>
  );
};

export default SeekerSessionsTab;