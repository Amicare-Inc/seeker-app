import React from 'react';
import { View, Text, Image } from 'react-native';
import { User } from '@/types/User';

interface SessionBookedProps {
  user: User | null;
}

const SessionBooked: React.FC<SessionBookedProps> = ({ user }) => {
  // Ensure that user is valid before rendering
  if (!user) {
    return (
      <View className="bg-gray-500 rounded-lg p-4 mb-2 flex-row items-center">
        <Text className="text-white">No user data available</Text>
      </View>
    );
  }

  return (
    <View className="bg-blue-500 rounded-lg p-4 mb-2 flex-row items-center">
      <Image
        source={{ uri: 'https://via.placeholder.com/50' }}
        className="w-12 h-12 rounded-full mr-4"
      />
      <View>
        <Text className="text-white font-bold">Appointment</Text>
        <Text className="text-white">{`With ${user.firstName}`}</Text> {/* Ensure user.firstName exists */}
      </View>
    </View>
  );
};

export default SessionBooked;