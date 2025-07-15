import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const CantRequestSessionScreen = () => {
  const [issueDetails, setIssueDetails] = useState('');

  const handleBackPress = () => {
    router.back();
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log('Issue details:', issueDetails);
  };

  return (
    <SafeAreaView className="flex-1 bg-grey-0">
      {/* Header */}
      <View className="flex-row items-center px-4 mb-[52px]">
        <TouchableOpacity onPress={handleBackPress} className="mr-4 absolute left-4">
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-xl font-medium">Account Help</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Section Title */}
        <Text className="text-base font-bold text-grey-80 mb-[22px]">I can't request a session</Text>

        {/* Description */}
        <Text className="text-base text-grey-80 mb-6 leading-5">
          You may be unable to request a session for several reasons. Below are some common issues and how to resolve them.
        </Text>

        {/* Issue 1 */}
        <View className="mb-4">
          <Text className="text-base font-bold text-grey-80 mb-2 underline">Issue 1:</Text>
          <Text className="text-base text-grey-80 leading-5">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ut leo nec tortor laoreet
          </Text>
        </View>

        {/* Issue 2 */}
        <View className="mb-6">
          <Text className="text-base font-bold text-grey-80 mb-2 underline">Issue 2:</Text>
          <Text className="text-base text-grey-80 leading-5">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ut leo nec tortor laoreet
          </Text>
        </View>

        {/* Still can't request section */}
        <View className="mb-4">
          <Text className="text-base font-bold text-grey-80 mb-2">Still can't request a session?</Text>
          <Text className="text-base text-grey-80 mb-[12px] leading-5">
            Fill out the form below and we'll be in touch to help
          </Text>
        </View>

        {/* Form */}
        <View className="mb-[22px]">
          <TextInput
            className="bg-white rounded-lg p-3 text-sm min-h-[160px]"
            placeholder="Provide specific details about the issue"
            placeholderTextColor="#9D9DA1"
            value={issueDetails}
            onChangeText={setIssueDetails}
            multiline
            textAlignVertical="top"
            style={{ fontSize: 16, fontWeight: '500' }}
          />
        </View>

        {/* Screenshot section */}
        <View className="mb-8">
          <Text className="text-base text-grey-80 mb-4">Screenshot of error</Text>
          <TouchableOpacity className="bg-grey-9 rounded-lg h-32 items-center justify-center">
            <Ionicons name="camera" size={32} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View className="px-4 pb-4">
        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-black rounded-lg py-4 items-center"
        >
          <Text className="text-white text-base font-medium">SUBMIT</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CantRequestSessionScreen;
