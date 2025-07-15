import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const AccountHelpScreen = () => {
  const handleBackPress = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      {/* Header */}
      <View className="flex-row items-center px-4 mb-[24px]">
        <TouchableOpacity onPress={handleBackPress} className="mr-4 absolute left-4">
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-xl font-medium">Account Help</Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="bg-white rounded-lg mx-4">
          <ListItem
            icon={<Ionicons name="list-circle" size={28} color="#303031" />}
            label="Can't sign in or request a session"
            onPress={() => router.push('/help/account-help/cant-sign-in')}
          />
          <ListItem
            icon={<Ionicons name="list-circle" size={28} color="#303031" />}
            label="Account settings"
            onPress={() => router.push('/help/account-help/account-settings')}
          />
          <ListItem
            icon={<Ionicons name="list-circle" size={28} color="#303031" />}
            label="Payment issues"
            onPress={() => router.push('/help/account-help/payment-issues')}
          />
          <ListItem
            icon={<Ionicons name="list-circle" size={28} color="#303031" />}
            label="Other"
            onPress={() => router.push('/help/account-help/other')}
          />
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

export default AccountHelpScreen;
