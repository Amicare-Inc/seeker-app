import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { Session } from "@/types/Sessions";
import SessionList from '@/components/SessionList';
import SessionModal from '@/components/SessionModal';
import { updateSessionStatus } from '@/services/firebase/firestore';
import { FIREBASE_AUTH } from '@/firebase.config';
import { useDispatch, useSelector } from 'react-redux';  
import { AppDispatch, RootState } from '@/redux/store';

import SessionBookedList from '@/components/SessionBookedList';
import { listenToUserSessions } from '@/services/firebase/fireStoreListeners';
import { router } from 'expo-router';
import { User } from '@/types/User';


const PswSessionsTab = () => {
   // Keeping expandedSession as a local state to handle modal expansion
   const [expandedSession, setExpandedSession] = useState<Session | null>(null);

   const dispatch: AppDispatch = useDispatch();
 
   // Getting session-related states from Redux
   const notConfirmedSessions = useSelector((state: RootState) => state.sessions.notConfirmedSessions);
   const confirmedSessions = useSelector((state: RootState) => state.sessions.confirmedSessions);
   const bookedSessions = useSelector((state: RootState) => state.sessions.bookedSessions);
   const pendingMap = useSelector((state: RootState) => state.sessions.pendingMap);
   const acceptedMap = useSelector((state: RootState) => state.sessions.acceptedMap);
   const bookedMap = useSelector((state: RootState) => state.sessions.bookedMap);
   const loading = useSelector((state: any) => state.sessions.loading);
   const error = useSelector((state: any) => state.sessions.error);

   // Listen for changes in the Firestore collection when component mounts
   useEffect(() => {
     console.log("Subscribing to Firestore listener for sessions...");
     listenToUserSessions(dispatch); // Start listening to sessions in Firestore

     // Optionally, return an unsubscribe function here if you need to stop listening when the component unmounts.
     // However, onSnapshot already handles live updates efficiently.
   }, [dispatch]);

   const handleExpandSession = (session: Session, requester:User) => {
    // console.log("MESSAGE EXPAND IN PSW: ",requester)
    if (session.status === 'accepted') {
      console.log("SESSION ID: ",session.id)
      console.log("HANDLEEXPNAD REQUESTER: ",requester)
      router.push({
        pathname: '/(chat)/[sessionId]',
        params: { sessionId: session.id, user: JSON.stringify(requester)}, // Pass session ID for chat
      });
    } else {
      setExpandedSession(session);  // Open modal for other cases (pending/booked)
    }
   };
 
   const handleCloseModal = () => {
     setExpandedSession(null);  // Close the session modal
   };

   // Handle user actions inside the modal (accept, reject, book)
   const handleAction = async (action: string) => {
     if (expandedSession) {
       if (action === 'accept_pending') {
         await updateSessionStatus(expandedSession.id, 'accepted');
       } else if (action === 'reject_pending') {
         await updateSessionStatus(expandedSession.id, 'rejected_pending');
       } else if (action === 'accept_confirmed') {
         await updateSessionStatus(expandedSession.id, 'booked');
       } else if (action === 'reject_confirmed') {
         await updateSessionStatus(expandedSession.id, 'rejected_confirmed');
       }
       handleCloseModal();  // Close the modal after action is taken
     }
   };

   const getUserForExpandedSession = () => {
    if (!expandedSession) return null;
  
    // Determine the correct user based on the session
    if (expandedSession.status === "pending") {
      return pendingMap[expandedSession.requesterId];
    } else if (expandedSession.status === "accepted") {
      return acceptedMap[expandedSession.targetUserId] || acceptedMap[expandedSession.requesterId];
    } else if (expandedSession.status === "booked") {
      return bookedMap[expandedSession.targetUserId] || bookedMap[expandedSession.requesterId];
    }
    
    return null;
  };
 
   // Handling loading and error states
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

        {/* Not Confirmed Yet Section */}
        <SessionList
          sessions={notConfirmedSessions} // Use Redux state here
          onSessionPress={handleExpandSession}  // Handle session press to expand
          requesterMap={pendingMap}  // Pass user data or map here if required
          title="Not Confirmed Yet"
        />

        {/* Confirmed/Upcoming Section */}
        <View className="mt-8">
          <SessionList
            sessions={confirmedSessions}  // Use Redux state for confirmed sessions
            onSessionPress={handleExpandSession}  // Handle  session press
            requesterMap={acceptedMap}  // Pass user data or map here if required
            title="Confirmed / Upcoming"
          />
        </View>

        {/* Booked Section */}
        <SessionBookedList
          sessions={bookedSessions}  // Use Redux state for booked sessions
          onSessionPress={handleExpandSession}  // Handle session press
          requesterMap={bookedMap}  // Pass user data or map here if required
          title="Booked"
        />
      </View>

      {/* Modal for Expanded Session */}
      <SessionModal
        onClose={handleCloseModal}  // Handle modal close
        isVisible={!!expandedSession}  // Check if modal should be visible
        onAction={handleAction}  // Handle modal actions (accept, reject, book)
        user={getUserForExpandedSession()}  // This should be replaced with the expanded session's user if needed
        isConfirmed={expandedSession?.status === "accepted"}
        isPending={expandedSession?.status === "pending"}
        isBooked={expandedSession?.status === "booked"}
      />
    </SafeAreaView>
  );
};

export default PswSessionsTab;