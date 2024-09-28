import { View, Text, SafeAreaView, ActivityIndicator, FlatList, Modal, TouchableOpacity,} from "react-native";
import React, { useEffect, useState } from "react";
import { User } from "@/types/User";
import { createBookingSession, getListOfUsers } from "@/services/firebase/firestore";
import UserCard from "@/components/UserCard";
import UserCardExpanded from "@/components/UserCardExpanded";

const SeekerHomeTab = () => {
  const [seekerUsers, setSeekerUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);


  useEffect(() => {
    const fetchPswUsers = async () => {
      try {
          const users = await getListOfUsers(false)
          setSeekerUsers(users)
      }
      catch (error) {
        console.error((error as any).message);
      }
      finally {
        setLoading(false);
      }
    };

    fetchPswUsers();
  }, []);

  const handleBookRequest = async (userId: string) => {
    try {
      await createBookingSession(userId);
      const updatedUsers = seekerUsers.filter(user => user.id !== userId);
      setSeekerUsers(updatedUsers);
      console.log("Booking request sent successfully!");
      setExpandedUserId(null);
    } catch (error) {
      console.error((error as any).message);
    }
  };

  const handleCardPress = (userId: string) => {
    setExpandedUserId(prevUserId => (prevUserId === userId ? null : userId));
  };

  const renderItem = ({ item }: { item: User }) => (
    <View className="">
      {expandedUserId === item.id ? (
        <UserCardExpanded user={item} onPress={() => setExpandedUserId(null)} />
      ) : (
        <UserCard user={item} onPress={() => handleCardPress(item.id)} />
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 h-full bg-white">
      <View className="flex-1 px-6 mt-6">
        <Text className="text-3xl font-bold text-center mb-3">
          Explore PSWs
        </Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View className="mt-2">
            <FlatList
              data={seekerUsers}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: 200 }}
            />
          </View>
        )}
      </View>
      {/* Display the Request Session button when a user is expanded */}
      {expandedUserId && (
        <View className="absolute bottom-0 left-0 right-0 p-4 pt-1 pb-2 bg-white">
          <TouchableOpacity
            onPress={() => handleBookRequest(expandedUserId)}
            className="bg-blue-500 rounded-lg py-4 flex items-center"
          >
            <Text className="text-white font-bold text-lg">Request Session</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default SeekerHomeTab;
