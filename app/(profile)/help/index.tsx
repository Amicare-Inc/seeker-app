import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const HelpScreen = () => {
  const handleBackPress = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      {/* Header */}
      <View className="flex-row items-center px-4">
        <TouchableOpacity onPress={handleBackPress} className="mr-4 absolute left-4">
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-xl font-medium">Help</Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="bg-white rounded-lg mx-4 mt-4">
          <ListItem
            icon={<Ionicons name="list-circle" size={28} color="#303031" />}
            label="Help with a session"
            onPress={() => {}}
          />
          <ListItem
            icon={<Ionicons name="list-circle" size={28} color="#303031" />}
            label="Account"
            onPress={() => {}}
          />
          <ListItem
            icon={<Ionicons name="list-circle" size={28} color="#303031" />}
            label="A guide to Amicare"
            onPress={() => {}}
          />
          <ListItem
            icon={<Ionicons name="list-circle" size={28} color="#303031" />}
            label="Accessibility"
            onPress={() => {}}
          />
        </View>

        <View className="mx-4 mt-8">
          <Text className="text-lg font-medium text-gray-80 mb-2">Need Help Now?</Text>
            <View className="bg-white rounded-lg">
            <ListItem
              icon={<Ionicons name="call" size={28} color="#303031" />}
              label="Call Support"
              onPress={() => {}}
            />
            </View>
        </View>

        <View className="mx-4 mt-8 mb-6">
          <Text className="text-lg font-medium text-gray-80 mb-2">Support Messages</Text>
          <View className="bg-white rounded-lg">
            <ListItem
              icon={<Ionicons name="chatbubble-ellipses" size={28} color="#303031" />}
              label="View all messages"
              onPress={() => {}}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

interface ListItemProps {
  icon: React.ReactNode; // Accept any React node as the icon
  label: string;
  onPress: () => void;
}
const ListItem: React.FC<ListItemProps> = ({ 
  icon, 
  label, 
  onPress, 
}) => {
  return (
    <TouchableOpacity onPress={onPress} className="flex-row items-center p-4 gap-3">
      <View className="w-7 h-7 rounded-lg bg-white items-center justify-center">
        {icon}
      </View>
      <Text className="flex-1 text-base text-grey-80 font-medium">{label}</Text>
      <Ionicons name="chevron-forward" size={20} color="#bfbfc3" />
    </TouchableOpacity>
  );
};

export default HelpScreen;