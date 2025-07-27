import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const AddEmailScreen = () => {
  const [email, setEmail] = useState('');

  const handleFinish = () => {
    console.log('Email:', email);
    // Navigate back or to the next screen
    router.back();
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-grey-0">
      <View className="flex-row items-center px-4 mb-[30px]">
        <TouchableOpacity onPress={handleBackPress} className="mr-4 absolute left-4 -translate-y-[14px]">
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-xl font-medium text-center">Add "Insert Name"s email{"\n"}address</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Description Text */}
        <View className="mb-[40px]">
          <Text className="text-center text-base text-grey-80 leading-5">
            "Insert Name"s email address is required to add him as a primary contact.
          </Text>
        </View>

        {/* Email Input */}
        <View className="mb-[14px]">
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email address"
            placeholderTextColor="#9D9DA1"
            className="bg-white p-3.5 rounded-lg text-lg font-medium border border-grey-9"
            style={{ color: 'black' }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Info Text */}
        <View>
          <Text className="text-sm text-grey-49 leading-5 mb-[58px]">
            Session updates will be sent to this email
          </Text>
        </View>
        
        {/* Finish Button */}
        <View className="pb-6">
            <TouchableOpacity
            onPress={handleFinish}
            className="bg-grey-94 py-4 rounded-xl items-center"
            >
            <Text className="text-white text-xl font-medium">Finish</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddEmailScreen;