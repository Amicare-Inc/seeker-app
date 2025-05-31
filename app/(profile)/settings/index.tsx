import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const SettingsScreen = () => {
  const handleBackPress = () => {
    router.back();
  };

  const handleLogout = () => {
    console.log('Logout pressed');
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      {/* Header */}
      <View className="flex-row items-center px-4">
        <TouchableOpacity onPress={handleBackPress} className="mr-4 absolute left-4">
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-xl font-medium">Settings</Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="bg-white rounded-lg mx-4 mt-6">
          {/* Personal Details */}
          <SettingsListItem
            icon={<Ionicons name="person" size={28} color="#303031" />}
            label="Personal Details"
            onPress={() => console.log('Personal Details pressed')}
          />
          {/* Security & Privacy */}
          <SettingsListItem
            icon={<Ionicons name="shield" size={28} color="#303031" />}
            label="Security & Privacy"
            onPress={() => router.push('/(profile)/settings/security-privacy')}
          />
          {/* Care Needs */}
          <SettingsListItem
            icon={<Ionicons name="list-circle" size={28} color="#303031" />}
            label="Care Needs"
            onPress={() => console.log('Care Needs pressed')}
          />
          {/* Care Schedule */}
          <SettingsListItem
            icon={<Ionicons name="time" size={28} color="#303031" />}
            label="Care Schedule"
            onPress={() => console.log('Care Schedule pressed')}
          />
          {/* Notifications */}
          <SettingsListItem
            icon={<Ionicons name="notifications" size={28} color="#303031" />}
            label="Notifications"
            onPress={() => console.log('Notifications pressed')}
          />
          {/* Log Out */}
          <SettingsListItem
            icon={<Ionicons name="log-out" size={28} color="#303031" />}
            label="Log Out"
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

interface SettingsListItemProps {
  icon: React.ReactNode; // Accept any React node as the icon
  label: string;
  onPress: () => void;
}

const SettingsListItem: React.FC<SettingsListItemProps> = ({ icon, label, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} className="flex-row items-center p-4 gap-3">
      <View className="w-7 h-7 items-center justify-center">
        {icon}
      </View>
      <Text className="flex-1 text-base text-grey-80 font-medium">{label}</Text>
      <Ionicons name="chevron-forward" size={20} color="#bfbfc3" />
    </TouchableOpacity>
  );
};

export default SettingsScreen;