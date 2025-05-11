import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import UserEditIcon from '../../assets/icons/user-edit.svg';

const SettingsScreen = () => {

  // const isPrimaryCareRecipient = true;

  const handleBackPress = () => {
    router.back();
  };

  const handleLogout = () => {
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      <View className="flex-row items-center px-4 pb-3">
        <TouchableOpacity 
          onPress={handleBackPress}
          className="mr-4"
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold">Settings</Text>
      </View>

      <ScrollView className="flex-1">
        <View className="bg-white rounded-lg mx-4 mt-6">
          <SettingsListItem
            icon="person"
            label="Personal Details"
            onPress={() => {}}
          />
          <SettingsListItem
            icon="shield"
            label="Security & Privacy"
            onPress={() => {}}
          />
          <SettingsListItem
            icon="list"
            label="Care Needs"
            onPress={() => {}}
            box
          />
          <SettingsListItem
            icon="time"
            label="Care Schedule"
            onPress={() => {}}
          />
          <SettingsListItem
            icon="notifications"
            label="Care Schedule"
            onPress={() => {}}
          />
          <SettingsListItem
            icon="log-out"
            label="Log Out"
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

interface SettingsListItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  box?: boolean;
}

const SettingsListItem: React.FC<SettingsListItemProps> = ({
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
      <View className={`w-7 h-7 rounded-lg ${box ? 'bg-[#303031]' : 'bg-white'} items-center justify-center`}>
        <Ionicons 
          name={icon as any} 
          size={box ? 16 : 26} 
          color={box ? "white" : "black"} 
        />
      </View>
      <Text className="flex-1 text-base text-neutral-800">{label}</Text>
      <Ionicons name="chevron-forward" size={20} color="#C5C5C7" />
    </TouchableOpacity>
  );
};

export default SettingsScreen;