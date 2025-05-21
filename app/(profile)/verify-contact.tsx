import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const VerifyContactScreen = () => {
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Skeleton: handle back navigation
  const handleBackPress = () => {
    router.back();
  };

  // Skeleton: validate contact (phone/email)
  const validateContact = (value: string) => {
    // TODO: Add validation logic for phone or email
    return value.trim().length > 0;
  };

  // Skeleton: handle input change
  const handleInputChange = (value: string) => {
    setContact(value);
    setError('');
  };

  // Skeleton: handle continue button
  const handleContinue = async () => {
    if (!validateContact(contact)) {
      setError('Please enter a valid phone number or email.');
      return;
    }
    setLoading(true);
    try {
      // TODO: Send verification code to contact
      // await sendVerificationCode(contact);
      router.push('/verify-code');
    } catch (e) {
      setError('Failed to send verification code.');
    } finally {
      setLoading(false);
    }
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
          <Text className="text-xl font-semibold">{"What's your phone number or email?"}</Text>
          <Text className="text-base mt-4">{"You’ll use this number to recover your account"}</Text>
          <View className="flex-row gap-5 mt-4 items-center justify-center">
            {/* Phone Number or Email Input */}
            <TextInput
              placeholder="Enter phone number or email"
              placeholderTextColor="#A3A3A3"
              className="bg-white h-[50px] pl-3.5 rounded-lg text-base flex-1"
              value={contact}
              onChangeText={handleInputChange}
              editable={!loading}
              keyboardType="default"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {error ? (
            <Text className="text-xs mt-2 text-red-500">{error}</Text>
          ) : null}
          <Text className="text-xs mt-4 text-grey-49 mb-20">
            {"A verification code will be sent to this number"}
          </Text>

          <TouchableOpacity
            className="bg-grey-94 py-4 rounded-xl items-center"
            onPress={handleContinue}
            disabled={loading}
          >
            <Text className="text-white text-xl font-medium">
              {loading ? 'Sending...' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VerifyContactScreen;