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
    
    // If Make Primary Contact is checked, navigate to add-email
    if (isPrimary) {
      router.push('/family/add-email');
    } else {
      // Otherwise, go back to the previous screen
      router.back();
    }
  };

  const handleDelete = () => {
    console.log('Delete contact');
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      <View className="flex-row items-center px-4 mb-[34px]">
        <TouchableOpacity onPress={handleBackPress} className="mr-4 absolute left-4">
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-xl font-medium">Add Family Member</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Profile Picture Holder */}
        <View className="items-center mb-[40px]">
          <View className="h-[100px] w-[100px] bg-grey-9 rounded-full items-center justify-center">
            <Text className="text-grey-58">Add Photo</Text>
          </View>
        </View>

        {/* Input Fields */}
        <View>
          <Text className="mb-2 text-base font-semibold">Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="First Name, Last Name"
            placeholderTextColor="#9D9DA1"
            className="bg-white p-3 rounded-lg text-lg mb-5 border border-grey-9"
            style={{ color: 'black' }}
          />
          <Text className="mb-2 text-base font-semibold">Phone Number</Text>
          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="e.g. (510) 123-4567"
            placeholderTextColor="#7B7B7E" // grey-35
            className="bg-white p-3.5 rounded-lg text-base mb-5 border border-grey-9"
            style={{ color: 'black' }}
          />
          <View className="flex-row w-full gap-3">
            <View className="w-1/2">
              <Text className="mb-2 text-base font-semibold">Country</Text>
              <TextInput
                value={country}
                onChangeText={setCountry}
                placeholder="..."
                placeholderTextColor="#9D9DA1" // grey-35
                className="bg-white p-3.5 rounded-lg text-base mb-5 border border-grey-9"
                style={{ color: 'black' }}
              />
            </View>
            <View className="flex-1">
              <Text className="mb-2 text-base font-semibold">City</Text>
              <TextInput
                value={city}
                onChangeText={setCity}
                placeholder="..."
                placeholderTextColor="#9D9DA1" // grey-35
                className="bg-white p-3.5 rounded-lg text-base mb-5 border border-grey-9"
                style={{ color: 'black' }}
              />
            </View>
 
          </View>


          {/* Checkbox */}
          <TouchableOpacity
            onPress={() => setIsPrimary(!isPrimary)}
            className="flex-row items-center space-x-2 mb-[20px]"
          >
            <Text className="text-base font-semibold">Make Primary Contact?</Text>
            <View
              className={`h-5 w-5 rounded border flex justify-center items-center ${
                isPrimary ? 'bg-brand-blue border-brand-blue' : 'border-black'
              }`}
            >
              {isPrimary && <Ionicons name="checkmark" size={16} color="white" />}
            </View>
            <Text className="underline text-brand-blue text-xs">What's this?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            className="flex-row items-center space-x-2"
          >
            <Text className="text-base font-semibold">Make Care Recipient?</Text>
            <View
              className="h-5 w-5 rounded border flex justify-center items-center border-black"
            >
              <Ionicons name="checkmark" size={16} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Save and Delete Buttons */}
      <View className="px-4 pb-6">
        <View className="flex-row items-start mb-[30px]">
            <Ionicons name="information-circle" size={28} color="#BFBFC3" className="mr-2 mt-0.5" />
            <Text className="text-xs text-grey-49 leading-4 flex-1 ml-2">
              By saving, you confirm this person has consented to be added and may receive session info.{' '}
              <Text className="text-brand-blue">Privacy Policy</Text>
            </Text>
        </View>
        <TouchableOpacity
          onPress={handleSave}
          className="bg-grey-94 py-4 rounded-xl items-center"
        >
          <Text className="text-white text-xl font-medium">Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FamilyAddScreen;