// @/components/SessionList.tsx
import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { EnrichedSession } from "@/types/EnrichedSession";

interface SessionListProps {
  sessions: EnrichedSession[];
  onSessionPress: (session: EnrichedSession) => void;
  title: string;
}

/**
 * Displays a horizontal row of bigger circle avatars with the user’s first name below each.
 */
const SessionList: React.FC<SessionListProps> = ({ sessions, onSessionPress, title }) => {
  const renderItem = ({ item }: { item: EnrichedSession }) => {
    if (!item.otherUser) return null;
    return (
      <TouchableOpacity
        onPress={() => onSessionPress(item)}
        className="items-center mr-6"
      >
        <Image
          source={{
            uri: item.otherUser.profilePhotoUrl || "https://via.placeholder.com/50",
          }}
          className="w-20 h-20 rounded-full mb-2"
        />
        <Text className="text-base " style={{ color: "#00000099" }} >{item.otherUser.firstName}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="mt-5">
      <Text className="text-xl mb-3 text-black">{title}</Text>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4 }}
      />
    </View>
  );
};

export default SessionList;