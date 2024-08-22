import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebase.config';
import { collection, query, where, getDocs, getDoc, doc, updateDoc } from 'firebase/firestore';
import { User } from "@/types/User";
import { Session } from "@/types/Sessions";
import CustomButton from '@/components/CustomButton';

const SessionsTab = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [requesters, setRequesters] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = FIREBASE_AUTH.currentUser?.uid;

  useEffect(() => {
    const fetchSessionsAndRequesters = async () => {
      if (!currentUserId) {
        console.error("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(FIREBASE_DB, 'sessions'),
          where('targetUserId', '==', currentUserId),
          where('status', '!=', 'rejected')
        );
        const querySnapshot = await getDocs(q);

        const sessionList: Session[] = querySnapshot.docs.map(doc => ({
          ...doc.data() as Session,
          id: doc.id
        }));
        setSessions(sessionList);

        const requesterPromises = sessionList.map(async session => {
          const userDoc = await getDoc(doc(FIREBASE_DB, 'personal', session.requesterId));
          if (userDoc.exists()) {
            return { ...userDoc.data(), id: userDoc.id } as User;
          } else {
            console.warn(`No user found for requester ID: ${session.requesterId}`);
            return null;
          }
        });

        const requesterList = (await Promise.all(requesterPromises)).filter(user => user !== null) as User[];
        setRequesters(requesterList);
      } catch (error) {
        console.error("Error fetching sessions or requesters: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionsAndRequesters();
  }, [currentUserId]);

  const handleAccept = async (sessionId: string) => {
    try {
      await updateDoc(doc(FIREBASE_DB, 'sessions', sessionId), { status: 'accepted' });
      setSessions(prevSessions =>
        prevSessions.map(session =>
          session.id === sessionId ? { ...session, status: 'accepted' } : session
        )
      );
    } catch (error) {
      console.error("Error accepting session: ", error);
    }
  };

  const handleReject = async (sessionId: string) => {
    try {
      // Update the status to "rejected"
      await updateDoc(doc(FIREBASE_DB, 'sessions', sessionId), { status: 'rejected' });

      // Remove the rejected session from the list
      setSessions(prevSessions => prevSessions.filter(session => session.id !== sessionId));
    } catch (error) {
      console.error("Error rejecting session: ", error);
    }
  };


  const renderItem = ({ item }: { item: Session }) => {
    const requester = requesters.find(user => user.id === item.requesterId);
    return (
      <View className="bg-gray-300 p-4 rounded-lg mb-4 w-full">
        {item.status === 'pending' ? (
          <View>
            <Text className="text-lg font-semibold">
                Request from {requester?.firstName} {requester?.lastName}
            </Text>
            <View className="flex-row mt-4">
                <CustomButton title="Accept" handlePress={() => handleAccept(item.id)} />
                <View style={{ width: 10 }} />
                <CustomButton title="Reject" handlePress={() => handleReject(item.id)} />
            </View>
          </View>
        ) : (
          <View>
            <Text className="text-lg font-semibold">
                Session with {requester?.firstName} {requester?.lastName}
            </Text>
            <CustomButton title="Chat" handlePress={() => { /* Handle chat navigation */ }} />
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <View className="flex-1 p-4">
        <Text className="text-2xl font-bold text-black mb-4">Sessions</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          requesters.length > 0 ? (
            <FlatList
              data={sessions}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
            />
          ) : (
            <Text>No requests found</Text>
          )
        )}
      </View>
    </SafeAreaView>
  );
};

export default SessionsTab;