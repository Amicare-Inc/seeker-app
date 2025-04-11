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
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-4 pb-3 border-b border-gray-200">
        <TouchableOpacity onPress={handleBackPress} className="mr-4">
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold">Help</Text>
      </View>

      <ScrollView className="flex-1">
        <View className="bg-white border border-gray-200 rounded-lg mx-4 mt-4">
          <ListItem
            icon="help-circle"
            label="Help with a Session"
            onPress={() => {}}
          />
          <ListItem
            icon="person-circle"
            label="Account"
            onPress={() => {}}
          />
          <ListItem
            icon="book"
            label="A Guide to Amicare"
            onPress={() => {}}
          />
          <ListItem
            icon="options"
            label="Accessibility"
            onPress={() => {}}
            noBorder
          />
        </View>

        <View className="mx-4 mt-8">
          <Text className="text-base font-medium text-gray-500 mb-2">Need Help Now?</Text>
          <View className="bg-white border border-gray-200 rounded-lg">
            <ListItem
              icon="call"
              label="Call Support"
              onPress={() => {}}
              noBorder
            />
          </View>
        </View>

        <View className="mx-4 mt-8 mb-6">
          <Text className="text-base font-medium text-gray-500 mb-2">Support Messages</Text>
          <View className="bg-white border border-gray-200 rounded-lg">
            <ListItem
              icon="chatbubbles"
              label="View all messages"
              onPress={() => {}}
              noBorder
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
  disabled?: boolean;
  noBorder?: boolean;
}

const ListItem: React.FC<ListItemProps> = ({ 
  icon, 
  label, 
  onPress, 
  disabled = false,
  noBorder = false
}) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      disabled={disabled}
      className={`flex-row items-center p-4 ${!noBorder ? 'border-b border-gray-200' : ''}`}
    >
      <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center mr-3">
        <Ionicons name={icon as any} size={18} color="black" />
      </View>
      <Text className="flex-1 text-base">{label}</Text>
      <Ionicons name="chevron-forward" size={20} color="#C5C5C7" />
    </TouchableOpacity>
  );
};

export default HelpScreen;