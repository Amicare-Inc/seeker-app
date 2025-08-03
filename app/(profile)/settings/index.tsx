import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useDispatch } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { FIREBASE_AUTH } from '@/firebase.config';
import { clearActiveProfile } from '@/redux/activeProfileSlice';
import { clearUser } from '@/redux/userSlice';

const SettingsScreen = () => {
  const handleBackPress = () => {
    router.back();
  };

  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const handleSignOut = async () => {
    try {
      // Sign out from Firebase
      await FIREBASE_AUTH.signOut();

      // Clear Redux state
      dispatch(clearUser());
      dispatch(clearActiveProfile());
      
      // Clear React Query cache
      queryClient.clear();

      // Navigate to the sign-in screen (or your landing page)
      router.replace('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-grey-0">
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
            icon={<Ionicons name="person" size={28} color="#BFBFC3" />}
            label="Personal Details"
            onPress={() => {}}
            disabled
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
            onPress={() => router.push('/(profile)/settings/edit-onboarding-details/edit_care_needs_1')}
            disabled
          />
          {/* Care Schedule */}
          <SettingsListItem
            icon={<Ionicons name="time" size={28} color="#303031" />}
            label="Care Schedule"
            onPress={() => router.push('/(profile)/settings/edit-onboarding-details/edit_care_schedule')}
            disabled
          />
          {/* Notifications */}
          <SettingsListItem
            icon={<Ionicons name="notifications" size={28} color="#303031" />}
            label="Notifications"
            onPress={() => router.push('/(profile)/settings/notifications')}
            disabled
          />
          {/* Log Out */}
          <SettingsListItem
            icon={<Ionicons name="log-out" size={28} color="#303031" />}
            label="Log Out"
            onPress={handleSignOut}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

interface SettingsListItemProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

const SettingsListItem: React.FC<SettingsListItemProps> = ({ icon, label, onPress, disabled }) => {
  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      className="flex-row items-center p-4 gap-3"
      disabled={disabled}
      style={disabled ? { opacity: 0.5 } : undefined}
    >
      <View className="w-7 h-7 items-center justify-center">
        {icon}
      </View>
      <Text className="flex-1 text-base font-medium" style={{ color: disabled ? '#BFBFC3' : '#303031' }}>{label}</Text>
      <Ionicons name="chevron-forward" size={20} color="#bfbfc3" />
    </TouchableOpacity>
  );
};

export default SettingsScreen;