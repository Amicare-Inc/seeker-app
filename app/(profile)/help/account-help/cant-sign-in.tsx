import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const CantSignInScreen = () => {
  const handleBackPress = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      {/* Header */}
      <View className="flex-row items-center px-4 mb-[52px]">
        <TouchableOpacity onPress={handleBackPress} className="mr-4 absolute left-4">
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-xl font-medium">Account Help</Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Section Title */}
        <View className="ml-[16px] mb-[18px]">
          <Text className="text-base font-bold text-black">Can't sign in or request a session</Text>
        </View>

        <View className="rounded-lg">
          <ListItem
            icon={<Ionicons name="document-text" size={24} color="#303031" />}
            label="I can't request a session"
            onPress={() => { router.push('/help/account-help/cant-request-session'); }}
            isFirst={true}
          />
          <ListItem
            icon={<Ionicons name="document-text" size={24} color="#303031" />}
            label="I can't sign into my account"
            onPress={() => { router.push('/help/account-help/cant-sign-in/sign-in'); }}
          />
          <ListItem
            icon={<Ionicons name="document-text" size={24} color="#303031" />}
            label="I lost access to my phone number"
            onPress={() => { router.push('/help/account-help/cant-sign-in/lost-phone'); }}
          />
          <ListItem
            icon={<Ionicons name="document-text" size={24} color="#303031" />}
            label="I can't clear a pending amount"
            onPress={() => { router.push('/help/account-help/cant-sign-in/pending-amount'); }}
          />
          <ListItem
            icon={<Ionicons name="document-text" size={24} color="#303031" />}
            label="My account was hacked/stolen"
            onPress={() => { router.push('/help/account-help/cant-sign-in/hacked'); }}
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
  isFirst?: boolean;
}

const ListItem: React.FC<ListItemProps> = ({ 
  icon, 
  label, 
  onPress,
  isFirst = false
}) => {
  return (
    <TouchableOpacity onPress={onPress} className={`flex-row items-center py-[14px] border-b border-[#DCDCE1] ${isFirst ? 'border-t border-[#DCDCE1]' : ''}`}>
      <View className="w-7 h-7 rounded-lg items-center justify-center ml-[10px]">
        {icon}
      </View>
      <Text className="flex-1 text-base text-grey-80 font-medium ml-[8px]">{label}</Text>
    </TouchableOpacity>
  );
};

export default CantSignInScreen;
