import React, { useState } from "react";
import { SafeAreaView, View, Text, ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import useAvailableUsers from "@/hooks/useHomeTab";
import { router } from "expo-router";
import UserCard from "@/components/UserCard";
import UserCardExpanded from "@/components/UserCardExpanded";
import { User } from "@/types/User";

const PswHomeTab = () => {
  // Fetch available PSWs (isPsw=false)
  const { users, loading, error } = useAvailableUsers(false);
  const [expandedUserId, setExpandedUserId] = React.useState<string | null>(null);

  const handleBookRequest = (userId: string) => {
    router.push({
      pathname: "/request-sessions",
      params: { otherUserId: userId },
    });
  };

  const handleCardPress = (userId: string) => {
    setExpandedUserId(prev => (prev === userId ? null : userId));
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
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 mt-6">
        <Text className="text-3xl font-bold text-center mb-3">Explore Care Seekers</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : error ? (
          <Text>Error: {error}</Text>
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 200 }}
          />
        )}
      </View>
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

export default PswHomeTab;