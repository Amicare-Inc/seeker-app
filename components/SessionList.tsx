import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { Session } from "@/types/Sessions";
import { User } from "@/types/User";

interface SessionListProps {
  sessions: Session[];
  onSessionPress: (session: Session, requester: User) => void;
  requesterMap: { [key: string]: User };
  title: string;
}

const SessionList: React.FC<SessionListProps> = ({ sessions, onSessionPress, requesterMap, title }) => {
    // console.log("IN Session LIST BEGINNING", requesterMap)
    const renderItem = ({ item }: { item: Session }) => {
        const requester: User | undefined = requesterMap[item.targetUserId] 
            ? requesterMap[item.targetUserId] 
            : requesterMap[item.requesterId];
        if (!requester) {
            return null; // Or you could return some default UI or handle it as needed
        }
        // console.log("IN Session LIST AFTER",requester)
        return (
        <TouchableOpacity onPress={() => onSessionPress(item, requester)} className="flex-col items-center mr-4">
            <Image
            source={{ uri: requester.profilePhotoUrl }}  // Using hardcoded mock image
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