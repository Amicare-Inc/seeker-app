import { View, Text, SafeAreaView, ScrollView, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { FIREBASE_DB } from "@/firebase.config";
import { User } from "@/types/User";

const Home = () => {
  const [pswUsers, setPswUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPswUsers = async () => {
      try {
        const q = query(
          collection(FIREBASE_DB, "personal"),
          where("isPSW", "==", true)
        );
        const querySnapshot = await getDocs(q);
        const users: User[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as User;
          users.push({
            ...data,
            id: doc.id,
          });
        });
        setPswUsers(users);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching PSW users: ", error);
        setLoading(false);
      }
    };

    fetchPswUsers();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
        {pswUsers.map((user) => (
          <View key={user.id} className="bg-gray-100 p-4 rounded-lg mb-4 shadow w-full">
            <Text className="text-lg font-bold text-gray-800">
              {user.firstName} {user.lastName}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
