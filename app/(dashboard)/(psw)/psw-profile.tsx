// MyProfileScreen.tsx
import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const MyProfileScreen = () => {
  // Grab user data from Redux
  const userData = useSelector((state: RootState) => state.user.userData);
  console.log("PROFILE")
  if (!userData) {
    return (
      <SafeAreaView className="flex-1 bg-white p-4">
        <Text className="text-base text-black">
          No user data available.
        </Text>
      </SafeAreaView>
    );
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    address,
    isPsw,
    carePreferences,
    // ... any other fields you have
  } = userData;

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4">
        My Profile
      </Text>

      {/* Basic Info */}
      <Text className="text-sm font-semibold mt-3">
        Name:
      </Text>
      <Text className="text-base mt-1">
        {firstName} {lastName}
      </Text>

      <Text className="text-sm font-semibold mt-3">
        Email:
      </Text>
      <Text className="text-base mt-1">
        {email}
      </Text>

      <Text className="text-sm font-semibold mt-3">
        Phone:
      </Text>
      <Text className="text-base mt-1">
        {phone}
      </Text>

      <Text className="text-sm font-semibold mt-3">
        Address:
      </Text>
      <Text className="text-base mt-1">
        {address}
      </Text>

      <Text className="text-sm font-semibold mt-3">
        Are you a PSW?:
      </Text>
      <Text className="text-base mt-1">
        {isPsw ? 'Yes' : 'No'}
      </Text>

      {/* Optional: Care Preferences */}
      {carePreferences && (
        <View>
          <Text className="text-sm font-semibold mt-3">
            Care Preferences:
          </Text>
          <Text className="text-base mt-1">
            {carePreferences.bio
              ? carePreferences.bio
              : 'No bio provided'}
          </Text>
          
          <Text className="text-sm font-semibold mt-3">
            Tasks:
          </Text>
          <Text className="text-base mt-1">
            {carePreferences.tasks?.join(', ') || 'N/A'}
          </Text>

          <Text className="text-sm font-semibold mt-3">
            Care Types:
          </Text>
          <Text className="text-base mt-1">
            {carePreferences.careType?.join(', ') || 'N/A'}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default MyProfileScreen;