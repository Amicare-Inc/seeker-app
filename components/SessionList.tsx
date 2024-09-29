import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { Session } from "@/types/Sessions";
import { User } from "@/types/User";

interface SessionListProps {
  sessions: Session[];
  onSessionPress: (session: Session) => void;
  requesterMap: { [key: string]: User };
  isAccepted: boolean;
  title: string;
}

const SessionList: React.FC<SessionListProps> = ({ sessions, onSessionPress, requesterMap, isAccepted, title }) => {
    const renderItem = ({ item }: { item: Session }) => {
        const requester: User = requesterMap[item.targetUserId] 
            ? requesterMap[item.targetUserId] 
            : requesterMap[item.requesterId];

        return (
        <TouchableOpacity onPress={() => onSessionPress(item)} className="flex-col items-center mr-4">
            <Image
            source={{ uri: "https://via.placeholder.com/50" }}  // Using hardcoded mock image
            className="w-16 h-16 rounded-full"
            />
            <Text className="text-center mt-2">{requester.firstName}</Text>
        </TouchableOpacity>
        );
    };

  return (
    <View>
      <Text className="text-xl font-semibold mb-2">{title}</Text>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        contentContainerStyle={{ paddingHorizontal: 10 }}
      />
    </View>
  );
};

export default SessionList;