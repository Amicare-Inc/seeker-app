import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const sessionData = [
  { name: 'Jane W.', date: '30 Oct', time: '10:00', price: '$270', image: require('@/assets/default-profile.png') },
  { name: 'Winston C.', date: '26 Oct', time: '13:00', price: '$130', image: require('@/assets/default-profile.png') },
  { name: 'Philip H.', date: '25 Oct', time: '16:00', price: '$100', image: require('@/assets/default-profile.png') },
  { name: 'Jane W.', date: '22 Oct', time: '11:00', price: '$85', image: require('@/assets/default-profile.png') },
  { name: 'Jane W.', date: '18 Oct', time: '09:00', price: '$400', image: require('@/assets/default-profile.png') },
  { name: 'Jane W.', date: '17 Oct', time: '09:00', price: '$155', image: require('@/assets/default-profile.png') },
  { name: 'Emily T.', date: '16 Oct', time: '09:00', price: '$155', image: require('@/assets/default-profile.png') },
  { name: 'Emily T.', date: '15 Oct', time: '11:00', price: '$155', image: require('@/assets/default-profile.png') },
  { name: 'Richard M.', date: '14 Oct', time: '13:30', price: '$155', image: require('@/assets/default-profile.png') },
  { name: 'Winston C.', date: '18 Oct', time: '09:00', price: '$155', image: require('@/assets/default-profile.png') },
  { name: 'Richard M.', date: '18 Oct', time: '09:00', price: '$155', image: require('@/assets/default-profile.png') },
  { name: 'Jane W.', date: '14 Oct', time: '09:00', price: '$155', image: require('@/assets/default-profile.png') },
];

const SessionHistory = () => {
  return (
    <SafeAreaView className="flex-1 bg-[#F7F7F7]">
      <View className="flex-row items-center px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-medium">Session <Text className="bg-yellow-300 px-2 rounded">History</Text></Text>
      </View>
      <ScrollView className="flex-1">
        <View className="bg-white rounded-xl mx-4 mt-2 mb-4">
          {sessionData.map((session, idx) => (
            <TouchableOpacity key={idx} className="flex-row items-center px-4 py-3 border-b border-gray-100">
              <Image source={session.image} className="w-10 h-10 rounded-full mr-3" />
              <View className="flex-1">
                <Text className="font-medium text-base">{session.name}</Text>
                <Text className="text-xs text-gray-500">{session.date} · {session.time}</Text>
              </View>
              <Text className="font-medium text-base">{session.price}</Text>
              <Ionicons name="chevron-forward" size={18} color="#bfbfc3" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SessionHistory;
