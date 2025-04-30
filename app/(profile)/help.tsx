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
      <View className="flex-row items-center px-4 pb-3">
        <TouchableOpacity onPress={handleBackPress} className="mr-4">
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold">Help</Text>
      </View>

      <ScrollView className="flex-1">
        <View className="bg-white rounded-lg mx-4 mt-4">
          <ListItem
            icon="menu"
            label="Help with a session"
            onPress={() => {}}
            box
          />
          <ListItem
            icon="menu"
            label="Account"
            onPress={() => {}}
            box
          />
          <ListItem
            icon="menu"
            label="A guide to Amicare"
            onPress={() => {}}
            box
          />
          <ListItem
            icon="menu"
            label="Accessibility"
            onPress={() => {}}
            box
          />
        </View>

        <View className="mx-4 mt-8">
          <Text className="text-lg font-medium text-gray-800 mb-2">Need Help Now?</Text>
            <View className="bg-white rounded-lg">
            <ListItem
              icon="call"
              label="Call Support"
              onPress={() => {}}
            />
            </View>
        </View>

        <View className="mx-4 mt-8 mb-6">
          <Text className="text-lg font-medium text-gray-800 mb-2">Support Messages</Text>
          <View className="bg-white rounded-lg">
            <ListItem
              icon="chatbox"
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
  icon: string;
  label: string;
  onPress: () => void;
  box?: boolean;
}
const ListItem: React.FC<ListItemProps> = ({ 
  icon, 
  label, 
  onPress, 
  box = false,
}) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className={`flex-row items-center p-4 gap-3`}
    >
      <View className={`w-7 h-7 rounded-lg ${!box ? 'bg-white' : 'bg-[#303031]'} items-center justify-center`}>
        <Ionicons 
          name={icon as any} 
          size={22} 
          color={box ? "white" : "black"
          } 
        />
      </View>
      <Text className="flex-1 text-base font-medium">{label}</Text>
      <Ionicons name="chevron-forward" size={20} color="#C5C5C7" />
    </TouchableOpacity>
  );
};

export default HelpScreen;