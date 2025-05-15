import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import CountryPicker, { CountryCode } from 'react-native-country-picker-modal';

const RecoveryPhoneScreen = () => {
  const [countryCode, setCountryCode] = useState<CountryCode>('US'); // Default country code
  const [callingCode, setCallingCode] = useState('1'); // Default calling code
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleBackPress = () => {
    router.back();
  };

  const handleSelectCountry = (country: any) => {
    setCountryCode(country.cca2);
    setCallingCode(country.callingCode[0]);
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      {/* Header */}
      <View className="flex-row items-center px-4">
        <TouchableOpacity onPress={handleBackPress} className="mr-4 absolute left-4">
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-xl font-medium">Security & Privacy</Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="mx-4 mt-10">
          <Text className="text-xl font-semibold">Recovery Phone</Text>
          <Text className="text-base mt-4">You’ll use this number to recover your account</Text>
          <View className="flex-row gap-5 mt-4 items-center justify-center">
            {/* Country Selector */}
            <View className="w-1/4 bg-white rounded-lg flex-row items-center pl-3.5" style={{ height: 50 }}>
              <CountryPicker
                countryCode={countryCode}
                withCallingCode
                withFlag
                withFilter
                withEmoji
                onSelect={handleSelectCountry}
              />
              <Text className="ml-1 text-base text-grey-35" style={{ textAlignVertical: 'center' }}>+{callingCode}</Text>
            </View>
            {/* Phone Number Input */}
            <TextInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="(510) 123-4567"
              placeholderTextColor="#A3A3A3"
              className="bg-white h-[50px] pl-3.5 rounded-lg text-base flex-1"

            />
          </View>
          <Text className="text-xs mt-4 text-grey-49 mb-20">
            A verification code will be sent to this number
          </Text>

          <TouchableOpacity className="bg-grey-94 py-4 rounded-xl items-center">
            <Text className="text-white text-xl font-medium">Update</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RecoveryPhoneScreen;