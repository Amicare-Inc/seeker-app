import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebase.config';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { User } from "@/types/User";
import { Session } from "@/types/Sessions";

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
          where('targetUserId', '==', currentUserId)
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

  const renderItem = ({ item }: { item: User }) => (
    <View className="bg-gray-300 p-4 rounded-lg mb-4 w-full">
      <Text className="text-lg font-semibold">
        Request from {item.firstName} {item.lastName}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="h-full bg-white">
      <View className="flex-1 p-4">
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          requesters.length > 0 ? (
            <FlatList
              data={requesters}
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