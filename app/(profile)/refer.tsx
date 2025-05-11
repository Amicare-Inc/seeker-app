import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const ReferralsScreen = () => {
  const handleBackPress = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4">
        <TouchableOpacity onPress={handleBackPress} className="mr-4 absolute left-4">
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-xl font-medium">Referal</Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="bg-white border border-gray-200 rounded-lg mx-4 mt-4">
          <ListItem
            icon="gift"
            label="Refer and earn $XX"
            onPress={() => {}}
          />
          <ListItem
            icon="analytics"
            label="Track Referrals"
            onPress={() => {}}
          />
          <ListItem
            icon="link"
            label="Enter a referral link"
            subtitle="Only active in 30 day window from account creation"
            onPress={() => {}}
          />
          <ListItem
            icon="star"
            label="Explore Partnerships"
            subtitle="Get paid to promote Amicare"
            onPress={() => {}}
            noBorder
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

interface ListItemProps {
  icon: string;
  label: string;
  subtitle?: string;
  onPress: () => void;
  disabled?: boolean;
  noBorder?: boolean;
}

const ListItem: React.FC<ListItemProps> = ({ 
  icon, 
  label,
  subtitle,
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
      <View className="flex-1">
        <Text className="text-base">{label}</Text>
        {subtitle && <Text className="text-sm text-gray-500">{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#C5C5C7" />
    </TouchableOpacity>
  );
};

export default ReferralsScreen;