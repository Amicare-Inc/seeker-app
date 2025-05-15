import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const VerifyCodeScreen = () => {
  const [focusedInput, setFocusedInput] = useState<number | null>(null); // Track which input is focused
  const [code, setCode] = useState<string[]>(['', '', '', '']); // Store the 4-digit code

  const handleBackPress = () => {
    router.back();
  };

  const handleInputChange = (text: string, index: number) => {
    if (/^\d?$/.test(text)) {
      // Allow only numbers and ensure it's a single character
      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);

      // Automatically focus the next input if available
      if (text && index < 3) {
        setFocusedInput(index + 1);
      }
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
          <Text className="text-xl font-semibold">Enter Code</Text>
          <Text className="text-base mt-4">Enter the 4-digit code sent to you at:</Text>
          <Text className="text-base">XXX</Text>
          <View className="flex-row gap-2.5 mt-4 items-center">
            {/* Code Input */}
            {code.map((value, index) => (
              <TextInput
                key={index}
                value={value}
                maxLength={1} // Limit input to 1 character
                keyboardType="number-pad" // Show numeric keyboard
                placeholder=""
                className={`bg-white h-[50px] rounded-lg text-base w-[50px] text-center flex justify-center items-center ${
                  focusedInput === index ? 'border-2 border-brand-blue' : ''
                }`}
                onFocus={() => setFocusedInput(index)} // Set focused input index
                onBlur={() => setFocusedInput(null)} // Reset focused input index
                onChangeText={(text) => handleInputChange(text, index)} // Handle input change
              />
            ))}
          </View>
          <Text className="text-xs mt-4 text-grey-49">
            A verification code will be sent to this number
          </Text>
          <TouchableOpacity className="bg-white py-3 rounded-xl items-center mt-10 w-20">
            <Text className="w-fit">Resend</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-white py-3 rounded-xl items-center mt-5 w-[125px]">
            <Text className="w-fit">Other Options</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Continue Button at the Bottom */}
      <View className="absolute bottom-10 left-0 right-0 bg-neutral-100 px-4 py-4">
        <TouchableOpacity
          className="bg-grey-94 py-4 rounded-xl items-center"
          onPress={() => router.push('/verify-feedback')}
        >
          <Text className="text-white text-xl font-medium">Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default VerifyCodeScreen;