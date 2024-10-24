import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { Session } from "@/types/Sessions";
import { User } from "@/types/User";

interface SessionBookedListProps {
  sessions: Session[];
  onSessionPress: (session: Session, requester: User) => void;
  requesterMap: { [key: string]: User };
  title: string;
}

const SessionBookedList: React.FC<SessionBookedListProps> = ({ sessions, onSessionPress, requesterMap, title }) => {
    // console.log("IN BOOKED LIST BEGINNIG", requesterMap)
    const renderItem = ({ item }: { item: Session }) => {
        const requester: User | undefined = requesterMap[item.targetUserId] 
            ? requesterMap[item.targetUserId] 
            : requesterMap[item.requesterId];
        // console.log("booked REQUESTER",requester)
        if (!requester) {
            return null; // Or you could return some default UI or handle it as needed
        }
        // console.log("IN BOOKED LIST After", requesterMap)
        return (
        <TouchableOpacity onPress={() => onSessionPress(item, requester)} className="flex-row items-center justify-between mb-4 p-4 bg-blue-500 rounded-lg">
            <View className="flex-row items-center">
              <Image
                    source={{ uri: "https://via.placeholder.com/50" }} // Placeholder image URL
                    className="w-12 h-12 rounded-full mr-4"
              />
              <View>
                <Text className="font-bold text-white text-lg">Appointment</Text>
                <Text className="text-white">With {requester.firstName}</Text>
              </View>
            </View>
        </TouchableOpacity>
        );
    };

  return (
    <View className="mt-8">
      <Text className="text-xl font-semibold mb-2">{title}</Text>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      />
    </View>
  );
};

export default SessionBookedList;