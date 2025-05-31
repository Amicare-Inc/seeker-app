import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const PasswordScreen = () => {
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
          <Text className="text-xl font-medium">Security & Privacy</Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="mx-4 mt-10">
            <Text className="text-xl font-semibold">Password</Text>
            <Text className="text-base mt-4">Your password must be at least x characters long, and contain at least one digit and one non-digit character</Text>
            <Text className="mt-6 mb-2 text-base font-semibold">New Password</Text>
            <TextInput
                placeholder="..."
                placeholderTextColor="#A3A3A3"
                className="bg-white p-3.5 rounded-lg text-base mb-7"
                style={{ color: 'black' }}
            />
            <Text className="text-base font-semibold">Confirm new Password</Text>
            <TextInput
                placeholder="..."
                placeholderTextColor="#A3A3A3"
                className="bg-white p-3.5 rounded-lg text-base mb-7"
                style={{ color: 'black' }}
            />
            <TouchableOpacity
                className="bg-grey-94 py-4 rounded-xl items-center"
            >
                <Text className="text-white text-xl font-medium">Update</Text>
            </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

interface SettingsListItemProps {
  label: string;
  description?: string; // Optional description prop
  onPress: () => void;
}

const SettingsListItem: React.FC<SettingsListItemProps> = ({ label, description, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} className="flex-row items-start p-4 gap-3">
      <View className="flex-1">
        <Text className="text-base text-grey-80 font-medium w-2/3">{label}</Text>
        {description && (
          <Text className="text-base text-grey-49 mt-1 w-[90%]">{description}</Text> // Smaller font for description
        )}
      </View>
      <View className="absolute justify-center items-center right-4 top-1/2">
        <Ionicons name="chevron-forward" size={20} color="#bfbfc3" />
      </View>
    </TouchableOpacity>
  );
};

export default PasswordScreen;