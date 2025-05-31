import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const FamilyEditScreen = ({ route }: { route: any }) => {
  const member = route?.params?.member || {
    name: '',
    number: '',
    country: '',
    city: '',
    email: '',
    isPrimary: false,
  };

  const [phoneNumber, setPhoneNumber] = useState(member.number);
  const [country, setCountry] = useState(member.country);
  const [city, setCity] = useState(member.city);
  const [email, setEmail] = useState(member.email);
  const [isPrimary, setIsPrimary] = useState(member.isPrimary);

  const handleSave = () => {
    console.log({
      name,
      phoneNumber,
      country,
      city,
      email,
      isPrimary,
    });
    router.back(); // Navigate back after saving
  };

  const handleDelete = () => {
    console.log('Delete contact');
    router.back(); // Navigate back after deletion
  };

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
          <Text className="text-xl font-medium">Name</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4">
        <View className="items-center mt-8">
            <View className="h-[100px] w-[100px] bg-grey-9 rounded-full items-center justify-center">
            <Text className="text-grey-58"></Text>
            </View>
        </View>
        <View className="mt-8">
          <Text className="mb-2 text-base font-semibold">Phone Number</Text>
          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="e.g. (510) 123-4567"
            placeholderTextColor="#A3A3A3"
            className="bg-white p-3.5 rounded-lg text-base mb-5"
            style={{ color: 'black' }}
          />
          <View className="flex-row w-full gap-3">
            <View className="w-1/2">
              <Text className="mb-2 text-base font-semibold">Country</Text>
              <TextInput
                value={country}
                onChangeText={setCountry}
                placeholder="..."
                placeholderTextColor="#A3A3A3"
                className="bg-white p-3.5 rounded-lg text-base mb-5"
                style={{ color: 'black' }}
              />
            </View>
            <View className="flex-1">
              <Text className="mb-2 text-base font-semibold">City</Text>
              <TextInput
                value={city}
                onChangeText={setCity}
                placeholder="..."
                placeholderTextColor="#A3A3A3"
                className="bg-white p-3.5 rounded-lg text-base mb-5"
                style={{ color: 'black' }}
              />
            </View>
          </View>

          <Text className="mb-2 text-base font-semibold">Email Address (Optional)</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="..."
            placeholderTextColor="#A3A3A3"
            className="bg-white p-3.5 rounded-lg text-base mb-7"
            style={{ color: 'black' }}
          />

          {/* Checkbox */}
          <TouchableOpacity
            onPress={() => setIsPrimary(!isPrimary)}
            className="flex-row items-center space-x-2"
          >
            <Text className="text-base font-semibold">Make Primary Contact?</Text>
            <View
              className={`h-5 w-5 rounded border flex justify-center items-center ${
                isPrimary ? 'bg-brand-blue border-brand-blue' : 'border-black'
              }`}
            >
              {isPrimary && <Ionicons name="checkmark" size={16} color="white" />}
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Save and Delete Buttons */}
      <View className="px-4">
        <TouchableOpacity
          onPress={handleSave}
          className="bg-grey-94 py-4 rounded-xl items-center"
        >
          <Text className="text-white text-xl font-medium">Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleDelete}
          className="py-4 rounded-lg items-center"
        >
          <Text className="text-black text-base font-medium underline">Delete Contact</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FamilyEditScreen;