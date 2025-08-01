import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const FamilyScreen = () => {
  const handleBackPress = () => {
    router.back();
  };

  const familyMembers: any[] = [];

  return (
    <SafeAreaView className="flex-1 bg-grey-0">
      {/* Header */}
      <View className="flex-row items-center px-4">
        <TouchableOpacity onPress={handleBackPress} className="mr-4 absolute left-4">
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-xl font-medium">Family</Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="bg-white rounded-lg mx-4 mt-6">
          {/* No family members to display unless fetched from backend */}

          {/* Add New Member Button */}
          <FamilyListItem
            icon={"add" as keyof typeof Ionicons.glyphMap}
            name="Add New Member"
            number=""
            relationship=""
            onPress={() => {}}
            isPrimary={false}
            disabled
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

interface FamilyListItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  name: string;
  number: string;
  relationship: string;
  onPress: () => void;
  isPrimary?: boolean;
  disabled?: boolean;
}

const FamilyListItem: React.FC<FamilyListItemProps> = ({
  icon,
  name,
  number,
  relationship,
  onPress,
  isPrimary = false,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      className={`flex-row items-center p-4 gap-3`}
      disabled={disabled}
      style={disabled ? { opacity: 0.5 } : undefined}
    >
      <View className="h-[70px] w-[70px] bg-[#f2f2f7] rounded-full items-center justify-center">
        <Ionicons name={icon} size={20} color="#aeaeb2" />
      </View>
      <View className="flex-1">
        <Text className="text-base font-medium text-grey-80">{name}</Text>
        {number ? <Text className="text-base text-grey-49">{number}</Text> : null}
        {relationship ? (
          <Text className={`text-base ${isPrimary ? 'text-brand-blue font-semibold' : 'text-grey-49'}`}>
            {relationship}
          </Text>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#bfbfc3" />
    </TouchableOpacity>
  );
};

export default FamilyScreen;