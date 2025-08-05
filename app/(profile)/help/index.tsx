import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Linking, Alert } from 'react-native';

const HelpScreen = () => {
  const handleBackPress = () => {
    router.back();
  };

  const handleCallSupport = () => {
    const phoneNumber = 'tel:+18889949114';
    Linking.openURL(phoneNumber).catch(() => {
      Alert.alert('Error', 'Your device does not support calling.');
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-grey-0">
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
            icon={<Ionicons name="list-circle" size={28} color="#BFBFC3" />}
            label="Help with a session"
            onPress={() => {}}
            disabled
          />
          <ListItem
            icon={<Ionicons name="list-circle" size={28} color="#BFBFC3" />}
            label="Account"
            onPress={() => {}}
            disabled
          />
          <ListItem
            icon={<Ionicons name="list-circle" size={28} color="#BFBFC3" />}
            label="A guide to Amicare"
            onPress={() => {}}
            disabled
          />
          <ListItem
            icon={<Ionicons name="list-circle" size={28} color="#BFBFC3" />}
            label="Accessibility"
            onPress={() => {}}
            disabled
          />
        </View>

        <View className="mx-4 mt-8">
          <Text className="text-lg font-medium text-gray-80 mb-2">Need Help Now?</Text>
            <View className="bg-white rounded-lg">
            <ListItem
              icon={<Ionicons name="call" size={28} color="#303031" />}
              label="Call Support"
              onPress={handleCallSupport}
            />
            </View>
        </View>

        <View className="mx-4 mt-8 mb-6">
          <Text className="text-lg font-medium text-gray-80 mb-2">Support Messages</Text>
          <View className="bg-white rounded-lg">
            <ListItem
              icon={<Ionicons name="chatbubble-ellipses" size={28} color="#BFBFC3" />}
              label="View all messages"
              onPress={() => {}}
              disabled
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

interface ListItemProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}
const ListItem: React.FC<ListItemProps> = ({ 
  icon, 
  label, 
  onPress, 
  disabled
}) => {
  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      className="flex-row items-center p-4 gap-3"
      disabled={disabled}
      style={disabled ? { opacity: 0.5 } : undefined}
    >
      <View className="w-7 h-7 rounded-lg bg-white items-center justify-center">
        {icon}
      </View>
      <Text className="flex-1 text-base font-medium" style={{ color: disabled ? '#BFBFC3' : '#303031' }}>{label}</Text>
      <Ionicons name="chevron-forward" size={20} color="#bfbfc3" />
    </TouchableOpacity>
  );
};

export default HelpScreen;