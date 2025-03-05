import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { EnrichedSession } from "@/types/EnrichedSession";

interface SessionBookedListProps {
  sessions: EnrichedSession[];
  onSessionPress: (session: EnrichedSession) => void;
  title: string;
}

/**
 * Displays a vertical list of "blue pills" for confirmed sessions,
 * with a bigger avatar (w-16, h-16) and less horizontal padding (px-4) to bring it left.
 */
const SessionBookedList: React.FC<SessionBookedListProps> = ({
  sessions,
  onSessionPress,
  title,
}) => {
  const renderItem = ({ item }: { item: EnrichedSession }) => {
    if (!item.otherUser) return null;

    // Use item.note or fallback text for the main label
    const mainLabel = item.note ? item.note.split(",")[0].trim() : "";
    // Other user's name
    const otherName = item.otherUser.firstName;
    // Example time
    const timeLabel = item.startTime
      ? new Date(item.startTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Time?";

    return (
      <TouchableOpacity
        onPress={() => onSessionPress(item)}
        // Slightly less horizontal padding (px-4) to bring the photo further left
        className="flex-row items-center justify-between rounded-full px-4 py-3 mb-6"
        style={{ backgroundColor: "#1A8BF8" }}
      >
        <View className="flex-row items-center">
          <Image
            source={{
              uri: item.otherUser.profilePhotoUrl || "https://via.placeholder.com/50",
            }}
            // Bigger photo: w-16 h-16
            className="w-16 h-16 rounded-full"
          />
          <View className="ml-3">
            <Text className="text-white text-lg">{mainLabel}</Text>
            <Text className="text-base" style={{ color: "#00000099" }} >with {otherName}</Text>
          </View>
        </View>
        <Text className="text-white text-lg ml-2">{timeLabel}</Text>
      </TouchableOpacity>
    );
  };

  return (
    // Add top margin for spacing above this section
    <View className="mt-8">
      <Text className="text-xl mb-3 text-black">{title}</Text>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4 }}
      />
    </View>
  );
};

export default SessionBookedList;