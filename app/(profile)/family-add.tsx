import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const FamilyAddScreen = () => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);

  const handleSave = () => {
    console.log({
      name,
      phoneNumber,
      country,
      city,
      email,
      isPrimary,
    });
  };

  const handleDelete = () => {
    console.log('Delete contact');
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      <View className="flex-row items-center px-4">
        <TouchableOpacity onPress={handleBackPress} className="mr-4 absolute left-4">
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-xl font-medium">Add Family Member</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Profile Picture Holder */}
        <View className="items-center mt-6">
          <View className="h-[100px] w-[100px] bg-grey-9 rounded-full items-center justify-center">
            <Text className="text-grey-58">Add Photo</Text>
          </View>
        </View>

        {/* Input Fields */}
        <View className="mt-6">
          <Text className="mb-2 text-base font-semibold">Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="First Name, Last Name"
            placeholderTextColor="#A3A3A3" // grey-35
            className="bg-white p-3.5 rounded-lg text-base mb-5"
            style={{ color: 'black' }}
          />
          <Text className="mb-2 text-base font-semibold">Phone Number</Text>
          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="e.g. (510) 123-4567"
            placeholderTextColor="#A3A3A3" // grey-35
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
                placeholderTextColor="#A3A3A3" // grey-35
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
                placeholderTextColor="#A3A3A3" // grey-35
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
            placeholderTextColor="#A3A3A3" // grey-35
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
      <View className="px-4 pb-6">
        <TouchableOpacity
          onPress={handleSave}
          className="bg-grey-94 py-4 rounded-lg items-center"
        >
          <Text className="text-white text-xl font-medium">Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FamilyAddScreen;