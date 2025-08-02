import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Share, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ref } from 'firebase/storage';

const ReferralsScreen = () => {
  const [referralLink] = useState('Link Unavailable In Beta'); // Placeholder for referral link

  const handleBackPress = () => {
    router.back();
  };

  const handleTrackReferrals = () => {

  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      Alert.alert('Copied!', 'Referral link copied to clipboard');
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleShareAmicare = async () => {
    try {
      await Share.share({
        message: `Share Amicare with friends who need care in Scarborough, Brampton and Mississauga. ${referralLink}`,
        title: 'Share Amicare',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity onPress={handleBackPress}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={handleTrackReferrals}
          className="bg-grey-9 px-4 py-1.5 rounded-full"
        >
          <Text className="text-sm text-grey-80 font-medium">Track Referrals</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View className="bg-[#CCE3F9] mx-4 mb-[39px] rounded-3xl py-12 px-6 h-[585px]">
          <Text className="text-brand-blue text-3xl font-extrabold tracking-tighter text-center mb-4">
            SHARE AMICARE
          </Text>
          
          <Text className="text-grey-80 text-center text-base font-medium leading-6 mb-12">
            Share Amicare with friends{'\n'}
            who need care in Scarborough,{'\n'}
            Brampton and Mississauga.
          </Text>

          {/* Profile Icon */}
          <View className="items-center mb-20">
            <View className="w-[178px] h-[178px] bg-white rounded-full items-center justify-center">

              <Ionicons name="person" size={100} color="#0C7AE2" />

              <View className="w-[48px] h-[48px] bg-[#75D87F] rounded-full items-center justify-center absolute bottom-8 right-8">
                <Ionicons name="paper-plane" size={26} color="white" />
              </View>
            </View>
          </View>

          {/* Share Link Section */}
          <View className="mb-6">
            <Text className="text-grey-80 font-medium text-sm mb-2 ml-3">Share your link:</Text>
            <View className="flex-row bg-transparent rounded-full p-2 px-4 pr-2 border border-grey-49 items-center relative">
              <Text className="text-brand-blue text-base font-semibold flex-1">
              {referralLink.length > 25
                ? referralLink.slice(0, 25) + '...'
                : referralLink}
              </Text>
              <TouchableOpacity
              onPress={handleCopyLink}
              className="bg-brand-blue px-5 py-2 rounded-full flex items-center justify-center ml-auto"
              >
              <Text className="text-white font-medium">Copy</Text>
              </TouchableOpacity>
            </View>
            </View>
          </View>
          <View className="flex mb-[53px] px-4">
            <View className="flex-row items-center gap-[13px] mb-[31px]">
              <View className="w-[38px] h-[38px] bg-[#CCE3F9] rounded-full flex items-center justify-center">
                <Text className="text-[#05549E] font-bold text-xl">1</Text>
              </View>
                <Text className="text-base text-grey-58">Share your unique referral link with 3{'\n'}friends</Text>
            </View>
            <View className="flex-row items-center gap-[13px] mb-[31px]">
              <View className="w-[38px] h-[38px] bg-[#CCE3F9] rounded-full flex items-center justify-center">
                <Text className="text-[#05549E] font-bold text-xl">2</Text>
              </View>
                <Text className="text-base text-grey-58">They download Amicare and spend $XX+{'\n'}on Sessions</Text>
            </View>
            <View className="flex-row items-center gap-[13px]">
              <View className="w-[38px] h-[38px] bg-[#CCE3F9] rounded-full flex items-center justify-center">
                <Text className="text-[#05549E] font-bold text-xl">3</Text>
              </View>
                <Text className="text-base text-grey-58">You earn $XX</Text>
            </View>

          </View>
        </ScrollView>


        {/* Share Button */}
        <View className="px-4 mb-6 border-t pt-4 border-[#79797966]">
          <TouchableOpacity
            onPress={handleShareAmicare}
            className="bg-black py-4 rounded-xl"
          >
            <Text className="text-white text-center text-xl">
              Share Amicare
            </Text>
          </TouchableOpacity>
        </View>

    </SafeAreaView>
  );
};

export default ReferralsScreen;