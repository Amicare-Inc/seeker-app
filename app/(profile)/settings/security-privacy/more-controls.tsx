import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const MorePrivacyControlsScreen = () => {
  const [selectedOption, setSelectedOption] = useState('public');

  const handleBackPress = () => {
    router.back();
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      {/* Header */}
      <View className="flex-row items-center px-4 mb-[54px]">
        <TouchableOpacity onPress={handleBackPress} className="mr-4 absolute left-4">
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-xl font-medium">More Privacy Controls</Text>
        </View>
      </View>

      <View className="flex-1 px-4">
        {/* Title */}
        <Text className="text-xl font-semibold text-black mb-[32px]">
          Make my profile only visible to:
        </Text>

        {/* Options */}
        <View className="space-y-6">
          {/* Public Option */}
          <TouchableOpacity
            onPress={() => handleOptionSelect('public')}
            className="flex-row items-center"
          >
            <View className="mr-4">
              {selectedOption === 'public' ? (
                <View className="h-6 w-6 rounded-lg bg-brand-blue items-center justify-center">
                  <Ionicons name="checkmark" size={16} color="white" />
                </View>
              ) : (
                <View className="h-6 w-6 border-2 border-grey-58 rounded-lg" />
              )}
            </View>
            <Text className="text-base text-black">Public (listed in search)</Text>
          </TouchableOpacity>

          {/* Private Option */}
          <TouchableOpacity
            onPress={() => handleOptionSelect('private')}
            className="flex-row items-center"
          >
            <View className="mr-4">
              {selectedOption === 'private' ? (
                <View className="h-6 w-6 rounded-lg bg-brand-blue items-center justify-center">
                  <Ionicons name="checkmark" size={16} color="white" />
                </View>
              ) : (
                <View className="h-6 w-6 border-2 border-grey-58 rounded-lg" />
              )}
            </View>
            <Text className="text-base text-black">Private (not shown, only matched directly)</Text>
          </TouchableOpacity>

          {/* Only Previously Matched Option */}
          <TouchableOpacity
            onPress={() => handleOptionSelect('matched')}
            className="flex-row items-center"
          >
            <View className="mr-4">
              {selectedOption === 'matched' ? (
                <View className="h-6 w-6 rounded-lg bg-brand-blue items-center justify-center">
                  <Ionicons name="checkmark" size={16} color="white" />
                </View>
              ) : (
                <View className="h-6 w-6 border-2 border-grey-58 rounded-lg" />
              )}
            </View>
            <Text className="text-base text-black">Only previously matched users</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MorePrivacyControlsScreen;