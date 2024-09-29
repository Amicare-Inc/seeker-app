import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { Session } from "@/types/Sessions";
import { User } from "@/types/User";
import { fetchUserSessions, getUserDoc } from '@/services/firebase/firestore';
import SessionList from '@/components/SessionList';
import SessionModal from '@/components/SessionModal';
import { FIREBASE_AUTH } from '@/firebase.config';

const PswSessionsTab = () => {
  const [notConfirmedSessions, setNotConfirmedSessions] = useState<Session[]>([]);
  const [confirmedSessions, setConfirmedSessions] = useState<Session[]>([]);
  const [expandedSession, setExpandedSession] = useState<Session | null>(null);
  const [pendingMap, setPendingMap] = useState<{ [key: string]: User }>({});
  const [acceptedMap, setAcceptedMap] = useState<{ [key: string]: User }>({});
  const [loading, setLoading] = useState(true);
  const currentUserId = FIREBASE_AUTH.currentUser?.uid;

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const pendingSessions = await fetchUserSessions("pending", "targetUserId");
        setNotConfirmedSessions(pendingSessions);
        const acceptedSessionsRequester = await fetchUserSessions("accepted", "requesterId");
        const acceptedSessionsTarget = await fetchUserSessions("accepted", "targetUserId");
        const acceptedSessions = [...acceptedSessionsRequester, ...acceptedSessionsTarget];
        setConfirmedSessions(acceptedSessions);
        // const acceptedSessions = await fetchUserSessions("accepted", "requesterId");
        // setConfirmedSessions(acceptedSessions);

        const pendingData: { [key: string]: User } = {};
        await Promise.all(pendingSessions.map(async (session) => {
          const userData = await getUserDoc(session.requesterId);
          if (userData) {
            pendingData[session.requesterId] = userData as User;
          }
        }));
        setPendingMap(pendingData);

        const acceptedData: { [key: string]: User } = {};
        await Promise.all(acceptedSessions.map(async (session) => {
          const userIdToFetch = session.requesterId === currentUserId
          ? session.targetUserId
          : session.requesterId;
          const userData = await getUserDoc(userIdToFetch);
          if (userData) {
            acceptedData[userIdToFetch] = userData as User;
          }
        }));
        setAcceptedMap(acceptedData);
  
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sessions:", error);
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleExpandSession = (session: Session) => {
    setExpandedSession(session);
  };

  const handleCloseModal = () => {
    setExpandedSession(null);
  };

    // Determine which map to use based on the session type
    const getUserForExpandedSession = () => {
      if (!expandedSession) return null;
  
      if (expandedSession.status === "pending") {
        return pendingMap[expandedSession.requesterId];
      } else if (expandedSession.status === "accepted") {
        return acceptedMap[expandedSession.targetUserId] || acceptedMap[expandedSession.requesterId];
      }
      return null;
    };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-4">
        <Text className="text-2xl font-bold text-black mb-4">Sessions</Text>

        {/* Not Confirmed Yet Section */}
        <SessionList
          sessions={notConfirmedSessions}
          onSessionPress={handleExpandSession}
          requesterMap={pendingMap}
          isAccepted = {false}
          title="Not Confirmed Yet"
        />

        {/* Confirmed/Upcoming Section */}
        <View className="mt-8">
          <SessionList
            sessions={confirmedSessions}
            onSessionPress={handleExpandSession}
            requesterMap={acceptedMap}
            isAccepted = {true}
            title="Confirmed / Upcoming"
          />
        </View>
      </View>

      {/* Modal for Expanded Session */}
      <SessionModal
        isVisible={!!expandedSession}
        onClose={handleCloseModal}
        user={getUserForExpandedSession()}
      />
    </SafeAreaView>
  );
};

export default PswSessionsTab;