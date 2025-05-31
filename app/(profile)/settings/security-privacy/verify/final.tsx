import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const VerifyFinalScreen = () => {
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
          <Text className="text-xl font-medium">Delete Account</Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="mx-4 mt-10">
          <Text className="text-xl font-semibold">Sorry to see you go.</Text>
          <Text className="text-base mt-4">
            If you change your mind, you can restore your account within 30 days by signing into your Amicare account. 
          </Text>
        </View>
        <View className="left-0 right-0 bg-neutral-100 px-4 py-4 flex gap-5 mt-20">
            <TouchableOpacity
            className="bg-grey-94 py-4 rounded-xl items-center"
            // onPress={() => router.push('/(profile)/settings/security-privacy')}
            >
            <Text className="text-white text-xl font-medium">Delete Account</Text>
            </TouchableOpacity>
            <TouchableOpacity
            className="bg-white py-4 rounded-xl items-center"
            // onPress={() => router.push('/(profile)/settings/security-privacy')}
>
            <Text className="text-black text-xl font-medium">Cancel</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VerifyFinalScreen;