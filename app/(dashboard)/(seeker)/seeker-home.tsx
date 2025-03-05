// @/screens/SeekerHomeTab.tsx
import React, { useState } from "react";
import { SafeAreaView, View, Text, ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import useAvailableUsers from "@/hooks/useHomeTab";
import { router } from "expo-router";
import UserCard from "@/components/UserCard";
import UserCardExpanded from "@/components/UserCardExpanded";
import { User } from "@/types/User";

const SeekerHomeTab = () => {
  const { users, loading, error } = useAvailableUsers(true);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

  const handleBookRequest = (userId: string) => {
    router.push({
      pathname: "/request-sessions",
      params: { otherUserId: userId },
    });
  };

  const handleCardPress = (userId: string) => {
    setExpandedUserId((prev) => (prev === userId ? null : userId));
  };

  const renderItem = ({ item }: { item: User }) => (
    <View>
      {expandedUserId === item.id ? (
        <UserCardExpanded user={item} onPress={() => setExpandedUserId(null)} />
      ) : (
        <UserCard user={item} onPress={() => handleCardPress(item.id)} />
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#f0f0f0" }}>
      {/* Header row */}
      <View className="flex-row items-center justify-between px-4 pt-4 pb-2">
        {/* Left side: Icon + Title */}
        <View className="flex-row items-center">
          <Ionicons name="people" size={24} color="black" style={{ marginRight: 8 }} />
          <Text className="text-xl font-mono text-black">Explore PSWs</Text>
        </View>

        {/* Right side: Filter icon */}
        <TouchableOpacity onPress={() => { /* Filter button currently does nothing */ }}>
          <Ionicons name="options" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Main content */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-black">Error: {error}</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 10 }}
        />
      )}

      {/* Bottom action button if a user is expanded */}
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