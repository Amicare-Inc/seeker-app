import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { EnrichedSession } from '@/types/EnrichedSession';

interface SessionListProps {
  sessions: EnrichedSession[];
  onSessionPress: (session: EnrichedSession) => void;
  title: string;
}

const SessionList: React.FC<SessionListProps> = ({ sessions, onSessionPress, title }) => {
  const renderItem = ({ item }: { item: EnrichedSession }) => {
    if (!item.otherUser) return null; // Only render if the other user is loaded
    return (
      <TouchableOpacity
        onPress={() => onSessionPress(item)}
        className="flex-col items-center mr-4"
      >
        <Image
          source={{ uri: item.otherUser?.profilePhotoUrl || 'https://via.placeholder.com/50' }}
          className="w-16 h-16 rounded-full"
        />
        <Text className="text-center mt-2">{item.otherUser?.firstName}</Text>
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