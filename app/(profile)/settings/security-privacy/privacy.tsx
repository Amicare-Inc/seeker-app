import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { View, Text, ScrollView, TouchableOpacity, Switch, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { PrivacyPolicyModal } from '@/features/privacy';
import { DataRetentionModal } from '@/features/privacy/components/DataRetentionModal';

import type { RootState } from '@/src/redux/store';

const PrivacySettingsScreen = () => {
  // Get userData from Redux
  const userData = useSelector((state: RootState) => state.user.userData);

  const [displayProfile, setDisplayProfile] = useState(true);
  const [showHealthInfo, setShowHealthInfo] = useState(true);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showDataRetentionModal, setShowDataRetentionModal] = useState(false);
  const [showDataDownloadModal, setShowDataDownloadModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleBackPress = () => {
    router.back();
  };

  const handleViewDataRetention = () => {
    setShowDataRetentionModal(true);
  };

  const handleViewPrivacyPolicy = () => {
    setShowPrivacyModal(true);
  };

  const handleDataDownloadRequest = async () => {
    setIsLoading(true);

    // Get user email from Redux
    const userEmail = userData?.email || '';

    if (!userEmail) {
      Alert.alert('Error', 'User email not found. Please log in again.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/support-request`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'data_download',
          email: userEmail,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log('Data download request submitted successfully:', result.id);
        // Show the success modal
        setShowDataDownloadModal(true);
      } else {
        throw new Error(result.message || 'Failed to submit data download request');
      }
    } catch (error) {
      console.error('Failed to submit data download request:', error);
      Alert.alert(
        'Error',
        'Failed to submit data download request. Please try again later.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const closeDataDownloadModal = () => {
    setShowDataDownloadModal(false);
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
          onPress={handleViewDataRetention}
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
          disabled={isLoading}
        />
      </ScrollView>
      
      <DataRetentionModal
        visible={showDataRetentionModal}
        onClose={() => setShowDataRetentionModal(false)}
      />
      <PrivacyPolicyModal 
        visible={showPrivacyModal} 
        onClose={() => setShowPrivacyModal(false)} 
      />

      {/* Data Download Request Submitted Modal */}
      <Modal
        transparent={true}
        visible={showDataDownloadModal}
        animationType="fade"
        onRequestClose={closeDataDownloadModal}
      >
        <TouchableWithoutFeedback onPress={closeDataDownloadModal}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <TouchableWithoutFeedback>
              <View className="bg-white rounded-[14px] p-6 items-center mx-4">
                <Text className="text-xl font-semibold mt-2 mb-4">Data Download Requested</Text>
                <Text className="text-center text-base text-grey-58 mb-6 font-medium">
                  Your data will be sent to your email shortly. Please allow up to 24 hours for processing.
                </Text>
                <TouchableOpacity
                  onPress={closeDataDownloadModal}
                  className="bg-black rounded-xl px-6 py-3 flex items-center justify-center"
                >
                  <Text className="text-base text-white font-medium">Done</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  disabled?: boolean;
}

const PrivacyNavigationItem: React.FC<PrivacyNavigationItemProps> = ({
  title,
  description,
  onPress,
  showChevron = false,
  disabled = false,
}) => {
  return (
    <View className="mb-4">
      {/* Clickable Section with White Background */}
      <TouchableOpacity 
        onPress={disabled ? undefined : onPress}
        className={`bg-white rounded-lg py-[10px] px-[16px] mb-2 ${disabled ? 'opacity-50' : ''}`}
        disabled={disabled}
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