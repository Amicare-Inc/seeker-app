import React from 'react';
import { View, Text, SafeAreaView, ScrollView, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const MyProfileScreen = () => {
  const userData = useSelector((state: RootState) => state.user.userData);

  if (!userData) {
    return (
      <SafeAreaView className="flex-1 bg-white p-4">
        <Text className="text-base text-black">No user data available.</Text>
      </SafeAreaView>
    );
  }

  const {
    firstName,
    lastName,
    dob,
    age,
    address,
    phone,
    email,
    isPsw,
    profilePhotoUrl,
    rate,
    idVerified,
    emailVerified,
    phoneVerified,
    hasProfilePhoto,
    carePreferences,
    onboardingComplete,
    bio,
  } = userData;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text className="text-2xl font-bold mb-4 text-center">My Profile</Text>

        {/* Profile Photo */}
        {profilePhotoUrl && (
          <View className="items-center mb-4">
            <Image
              source={{ uri: profilePhotoUrl }}
              className="w-32 h-32 rounded-full border-2 border-gray-300"
            />
          </View>
        )}

        {/* Basic Information */}
        <View className="mb-4">
          <Text className="text-sm font-semibold">Full Name:</Text>
          <Text className="text-base">{`${firstName} ${lastName}`}</Text>

          <Text className="text-sm font-semibold mt-3">Date of Birth:</Text>
          <Text className="text-base">{dob}</Text>

          <Text className="text-sm font-semibold mt-3">Age:</Text>
          <Text className="text-base">{age}</Text>

          <Text className="text-sm font-semibold mt-3">Email:</Text>
          <Text className="text-base">{email}</Text>

          <Text className="text-sm font-semibold mt-3">Phone:</Text>
          <Text className="text-base">{phone}</Text>

          <Text className="text-sm font-semibold mt-3">Address:</Text>
          <Text className="text-base">{address}</Text>

          <Text className="text-sm font-semibold mt-3">Are you a PSW?</Text>
          <Text className="text-base">{isPsw ? 'Yes' : 'No'}</Text>
        </View>

        {/* Verification Status */}
        <View className="mb-4">
          <Text className="text-sm font-semibold">Verification Status:</Text>
          <Text className="text-base">ID Verified: {idVerified ? '✅ Verified' : '❌ Not Verified'}</Text>
          <Text className="text-base">Email Verified: {emailVerified ? '✅ Verified' : '❌ Not Verified'}</Text>
          <Text className="text-base">Phone Verified: {phoneVerified ? '✅ Verified' : '❌ Not Verified'}</Text>
          <Text className="text-base">Profile Photo: {hasProfilePhoto ? '✅ Added' : '❌ Not Added'}</Text>
        </View>

        {/* Optional Info */}
        {rate !== undefined && (
          <View className="mb-4">
            <Text className="text-sm font-semibold">Rate:</Text>
            <Text className="text-base">${rate}/hr</Text>
          </View>
        )}

        {bio && (
          <View className="mb-4">
            <Text className="text-sm font-semibold">Bio:</Text>
            <Text className="text-base">{bio}</Text>
          </View>
        )}

        {/* Care Preferences */}
        {carePreferences && (
          <View className="mb-4">
            <Text className="text-sm font-semibold">Care Preferences:</Text>
            <Text className="text-base mt-1">
              Looking for Self: {carePreferences.lookingForSelf ? 'Yes' : 'No'}
            </Text>

            <Text className="text-sm font-semibold mt-3">Care Types:</Text>
            <Text className="text-base">
              {carePreferences.careType?.join(', ') || 'N/A'}
            </Text>

            <Text className="text-sm font-semibold mt-3">Tasks:</Text>
            <Text className="text-base">
              {carePreferences.tasks?.join(', ') || 'N/A'}
            </Text>

            <Text className="text-sm font-semibold mt-3">Availability:</Text>
            {carePreferences.availability ? (
              Object.entries(carePreferences.availability).map(([day, times]) => (
                <Text key={day} className="text-base">
                  {day}: {times.map((t) => `${t.start} - ${t.end}`).join(', ')}
                </Text>
              ))
            ) : (
              <Text className="text-base">N/A</Text>
            )}
          </View>
        )}

        {/* Onboarding Status */}
        <View className="mb-4">
          <Text className="text-sm font-semibold">Onboarding Complete:</Text>
          <Text className="text-base">{onboardingComplete ? '✅ Yes' : '❌ No'}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyProfileScreen;