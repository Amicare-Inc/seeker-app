import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, FlatList } from 'react-native';
import { Session } from "@/types/Sessions";
import { User } from "@/types/User";
import { fetchUserSessions, getUserDoc, updateSessionStatus } from '@/services/firebase/firestore';
import SessionList from '@/components/SessionList';
import SessionModal from '@/components/SessionModal';
import { FIREBASE_AUTH } from '@/firebase.config';
import { router, useFocusEffect } from 'expo-router';
import SessionBooked from '@/components/SessionBooked';
import SessionBookedList from '@/components/SessionBookedList';
import { useDispatch, useSelector } from 'react-redux';  // Import Redux hooks
import { fetchSessions, acceptSession, rejectSession, bookSession, rejectBookedSession } from '@/redux/sessionSlice'; // Import Redux actions
import { AppDispatch, RootState } from '@/redux/store'; 


const PswSessionsTab = () => {
   // Keeping expandedSession as a local state to handle modal expansion
   const [expandedSession, setExpandedSession] = useState<Session | null>(null);

   const dispatch: AppDispatch = useDispatch();
 
   // Getting session-related states from Redux
   const notConfirmedSessions = useSelector((state: any) => state.sessions.notConfirmedSessions);
   const confirmedSessions = useSelector((state: any) => state.sessions.confirmedSessions);
   const bookedSessions = useSelector((state: any) => state.sessions.bookedSessions);
   const loading = useSelector((state: any) => state.sessions.loading);
   const error = useSelector((state: any) => state.sessions.error);
   console.log("not  confimed pswtab: ",notConfirmedSessions)
 
   // Retrieve user maps from Redux store
   const pendingMap = useSelector((state: any) => state.sessions.pendingMap);
   const acceptedMap = useSelector((state: any) => state.sessions.acceptedMap);
   const bookedMap = useSelector((state: any) => state.sessions.bookedMap);
   console.log("use selector pending : " ,(pendingMap as any))
   console.log("use selector confirmed : " ,(acceptedMap as any))
   console.log("use selector booked : " ,(bookedMap as any))


   // Fetch sessions using Redux Thunk on component mount
   useEffect(() => {
     console.log("fetching effect")
     dispatch(fetchSessions());
   }, [dispatch]);
 
   const handleExpandSession = (session: Session) => {
     setExpandedSession(session);  // Set the session to be expanded
   };
 
   const handleCloseModal = () => {
     setExpandedSession(null);  // Close the session modal
   };
 
   // Handle user actions inside the modal (accept, reject, book)
   const handleAction = async (action: string) => {
     if (expandedSession) {
       if (action === 'accept') {
         await updateSessionStatus(expandedSession.id, 'accepted');
         dispatch(acceptSession(expandedSession.id));  // Dispatch accept action
       } else if (action === 'reject') {
         await updateSessionStatus(expandedSession.id, 'rejected');
         dispatch(rejectSession(expandedSession.id));  // Dispatch reject action
       } else if (action === 'book') {
         await updateSessionStatus(expandedSession.id, 'booked');
         dispatch(bookSession(expandedSession.id));  // Dispatch book action
       } else if (action === 'reject_book') {
        await updateSessionStatus(expandedSession.id, 'rejected_booked');
        dispatch(rejectBookedSession(expandedSession.id));  // Dispatch book action
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