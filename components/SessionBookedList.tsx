// src/components/SessionBookedList.tsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { EnrichedSession } from '@/types/EnrichedSession';

interface SessionBookedListProps {
  sessions: EnrichedSession[];
  onSessionPress: (session: EnrichedSession) => void;
  title: string;
}

const SessionBookedList: React.FC<SessionBookedListProps> = ({ sessions, onSessionPress, title }) => {
  const renderItem = ({ item }: { item: EnrichedSession }) => {
    if (!item.otherUser) return null;
    return (
      <TouchableOpacity
        onPress={() => onSessionPress(item)}
        className="flex-row items-center justify-between mb-4 p-4 bg-blue-500 rounded-lg"
      >
        <View className="flex-row items-center">
          <Image
            source={{ uri: item.otherUser.profilePhotoUrl || 'https://via.placeholder.com/50' }}
            className="w-12 h-12 rounded-full mr-4"
          />
          <View>
            <Text className="font-bold text-white text-lg">Appointment</Text>
            <Text className="text-white">With {item.otherUser.firstName}</Text>
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