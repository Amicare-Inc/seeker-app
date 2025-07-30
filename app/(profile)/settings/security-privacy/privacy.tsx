import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { PrivacyPolicyModal } from '@/features/privacy';

const PrivacySettingsScreen = () => {
  const [displayProfile, setDisplayProfile] = useState(true);
  const [showHealthInfo, setShowHealthInfo] = useState(true);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const handleBackPress = () => {
    router.back();
  };

  const handleDataRetention = () => {
    console.log('Navigate to Data Retention');
  };

  const handleViewPrivacyPolicy = () => {
    setShowPrivacyModal(true);
  };

  const handleDataDownloadRequest = () => {
    console.log('Navigate to Data Download Request');
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      {/* Header */}
      <View className="flex-row items-center px-4 mb-[28px]">
        <TouchableOpacity onPress={handleBackPress} className="mr-4 absolute left-4">
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-xl font-medium">Privacy Settings</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4">
        <PrivacyToggleItem
            title="Display my profile"
            description={
                <>
                    I consent to having my profile (photo, name, rate, and neighborhood) publicly listed and discoverable by verified users on the Amicare app.{' '}
                    <Text className="text-brand-blue" onPress={() => router.push('/(profile)/settings/security-privacy/more-controls')}>More Controls</Text>
                </>
            }
            value={displayProfile}
            onValueChange={setDisplayProfile}
        />

        {/* Show Health Info */}
        <PrivacyToggleItem
          title="Show Health Info"
          description="i.e. Mobility Support, Meal Prep, etc."
          value={showHealthInfo}
          onValueChange={setShowHealthInfo}
        />

        {/* Data Retention */}
        <PrivacyNavigationItem
          title="Data Retention"
          description="Find out what data of yours we store, and for how long it is stored. e.g. Chat, Sessions, etc."
          onPress={handleDataRetention}
        />

        {/* View Privacy Policy */}
        <PrivacyNavigationItem
          title="View Privacy Policy"
          description="Find out what data of yours we store, and for how long it is stored. e.g. Chat, Sessions, etc."
          onPress={handleViewPrivacyPolicy}
          showChevron={true}
        />

        {/* Data Download Request */}
        <PrivacyNavigationItem
          title="Data Download Request"
          description="Request a copy of the information you've shared on Amicare, including your profile, care history, and messages."
          onPress={handleDataDownloadRequest}
        />
      </ScrollView>
      
      <PrivacyPolicyModal 
        visible={showPrivacyModal} 
        onClose={() => setShowPrivacyModal(false)} 
      />
    </SafeAreaView>
  );
};

interface PrivacyToggleItemProps {
  title: string;
  description: React.ReactNode;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const PrivacyToggleItem: React.FC<PrivacyToggleItemProps> = ({
  title,
  description,
  value,
  onValueChange,
}) => {
  return (
    <View className="mb-4">
      {/* Toggle Section with White Background */}
      <View className="bg-white rounded-lg py-[6.5px] px-[16px] mb-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-base font-medium text-black flex-1 pr-4">{title}</Text>
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: '#E5E7EB', true: '#0C7AE2' }}
            thumbColor={value ? '#FFFFFF' : '#FFFFFF'}
            ios_backgroundColor="#E5E7EB"
          />
        </View>
      </View>
      
      {/* Description Section with Transparent Background */}
      <View className="px-4 mb-4">
        <Text className="text-[13px] text-grey-58 leading-5">
          {description}
        </Text>
      </View>
    </View>
  );
};

interface PrivacyNavigationItemProps {
  title: string;
  description: string;
  onPress: () => void;
  showChevron?: boolean;
}

const PrivacyNavigationItem: React.FC<PrivacyNavigationItemProps> = ({
  title,
  description,
  onPress,
  showChevron = false,
}) => {
  return (
    <View className="mb-4">
      {/* Clickable Section with White Background */}
      <TouchableOpacity 
        onPress={onPress}
        className="bg-white rounded-lg py-[10px] px-[16px] mb-2"
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-base font-medium text-black flex-1 pr-4">{title}</Text>
          {showChevron && (
            <Ionicons name="chevron-forward" size={20} color="#9D9DA1" />
          )}
        </View>
      </TouchableOpacity>
      
      {/* Description Section with Transparent Background */}
      <View className="px-4 mb-4">
        <Text className="text-[13px] text-grey-58 leading-5">
          {description}
        </Text>
      </View>
    </View>
  );
};

export default PrivacySettingsScreen;