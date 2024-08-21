import { View, Text, SafeAreaView, ScrollView, ActivityIndicator, FlatList } from "react-native";
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
          where("isPSW", "==", false)
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

  const renderItem = ({ item }: { item: User }) => (
    <View className="bg-gray-100 py-4 rounded-lg mb-4">
      <Text className="text-xl font-semibold px-20 text-left">{item.firstName} {item.lastName}</Text>
    </View>
  );

  return (
    <SafeAreaView className="h-full bg-white">
    <View className="flex-1 px-6">
      <Text className="text-3xl font-bold text-center mb-6">Explore</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={pswUsers}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}
    </View>
  </SafeAreaView>
  );
};

export default Home;
