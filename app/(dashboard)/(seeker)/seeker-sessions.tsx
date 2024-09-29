import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { Session } from "@/types/Sessions";
import { User } from "@/types/User";
import { fetchUserSessions, getUserDoc, updateSessionStatus } from '@/services/firebase/firestore';
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

  // Handle Accept and Reject Actions
  const handleAccept = async () => {
    if (expandedSession) {
      try {
        await updateSessionStatus(expandedSession.id, 'accepted');

        // First, update the pending sessions by removing the accepted session
        setNotConfirmedSessions(prevSessions =>
          prevSessions.filter(session => session.id !== expandedSession.id)
        );

        // Now, add the session to confirmedSessions and update acceptedMap
        const userData = await getUserDoc(
          expandedSession.requesterId === currentUserId
            ? expandedSession.targetUserId
            : expandedSession.requesterId
        );
        
        if (userData) {
          setAcceptedMap(prevMap => ({
            ...prevMap,
            [expandedSession.requesterId === currentUserId
              ? expandedSession.targetUserId
              : expandedSession.requesterId]: userData as User
          }));

          // Move the session to confirmedSessions
          setConfirmedSessions(prevSessions => [
            ...prevSessions,
            { ...expandedSession, status: 'accepted' }
          ]);
        }

        handleCloseModal();
      } catch (error) {
        console.error("Error accepting session:", error);
      }
    }
  };

  const handleReject = async () => {
    if (expandedSession) {
      try {
        await updateSessionStatus(expandedSession.id, 'rejected');
        
        // Remove session from both lists, since it's rejected
        setNotConfirmedSessions(prevSessions =>
          prevSessions.filter(session => session.id !== expandedSession.id)
        );
        setConfirmedSessions(prevSessions =>
          prevSessions.filter(session => session.id !== expandedSession.id)
        );
        
        handleCloseModal();
      } catch (error) {
        console.error("Error rejecting session:", error);
      }
    }
  };

  const handleReject2 = async () => {
    if (expandedSession) {
      try {
        await updateSessionStatus(expandedSession.id, 'rejected2');
        
        // Remove session from both lists, since it's rejected
        setNotConfirmedSessions(prevSessions =>
          prevSessions.filter(session => session.id !== expandedSession.id)
        );
        setConfirmedSessions(prevSessions =>
          prevSessions.filter(session => session.id !== expandedSession.id)
        );
        
        handleCloseModal();
      } catch (error) {
        console.error("Error rejecting2 session:", error);
      }
    }
  };

  const handleChat = () => {
    console.log("Chat initiated with:", expandedSession);
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
        onClose={handleCloseModal}
        isVisible={!!expandedSession}
        onAction={(action) => {
          if (action === 'accept') {
            handleAccept();
          } else if (action === 'rejected') {
            handleReject();
          } else if (action === 'chat') {
            handleChat();
          } else if (action === 'rejected2') {
            handleReject2()
          }
        }} // Single action handler
        user={getUserForExpandedSession()}
        isConfirmed={expandedSession?.status === "accepted"}
        isPending={expandedSession?.status === "pending"}
      />
    </SafeAreaView>
  );
};

export default PswSessionsTab;