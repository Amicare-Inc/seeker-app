import { View, Text, SafeAreaView, ScrollView, ActivityIndicator, FlatList,} from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {collection, doc, getDocs, query, setDoc, where,} from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/firebase.config";
import { User } from "@/types/User";
import CustomButton from "@/components/CustomButton";

const SeekerHomeTab = () => {
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

  const handleBookRequest = async (userId: string) => {
    try {
      const sessionId = `${FIREBASE_AUTH.currentUser?.uid}_${userId}`; // Create a unique session ID

      await setDoc(doc(collection(FIREBASE_DB, "sessions"), sessionId), {
        requesterId: FIREBASE_AUTH.currentUser?.uid, // The ID of the user making the booking request
        targetUserId: userId, // The ID of the user being booked
        status: "pending", // Initial status
        createdAt: new Date(), // Timestamp of the request
      });
      const updatedUsers = pswUsers.filter(user => user.id !== userId);
      setPswUsers(updatedUsers);
      console.log("Booking request sent successfully!");

    } catch (error) {
      console.error("Error sending booking request: ", error);
    }
  };

  const renderItem = ({ item }: { item: User }) => (
    <View className="bg-gray-100 py-4 rounded-lg mb-4">
      <Text className="text-xl font-semibold px-20 text-left">
        {item.firstName} {item.lastName}
      </Text>
      <CustomButton
        title="Book"
        handlePress={() => handleBookRequest(item.id)}
        containerStyles="mt-2 bg-blue-500" // You can style this as you prefer
      />
    </View>
  );

  return (
    <SafeAreaView className="h-full bg-white">
      <View className="flex-1 px-6">
        <Text className="text-3xl font-bold text-center mb-6">
          Explore PSWs
        </Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View className="mt-28">
            <FlatList
              data={pswUsers}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: 16 }}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default SeekerHomeTab;
