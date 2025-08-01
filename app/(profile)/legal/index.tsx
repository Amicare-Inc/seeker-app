import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { TermsOfUseModal } from '@/features/privacy/components/TermsOfUseModal';
import { PrivacyPolicyModal } from '@/features/privacy';

const LegalScreen = () => {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const handleBackPress = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-grey-0">
      {/* Header */}
      <View className="flex-row items-center px-4 mb-6">
        <TouchableOpacity onPress={handleBackPress} className="mr-4 absolute left-4">
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-xl font-medium">Legal</Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        <View>
          <LegalListItem
            label="Terms & Conditions"
            subtitle="View terms & conditions"
            onPress={() => setShowTermsModal(true)}
            containerStyles='rounded-lg mb-[6px]'
          />
          <Text className="mx-8 mb-[38px]">View terms & conditions</Text>
        </View>

        <View>
          {/* Privacy Policy */}
          <LegalListItem
            label="Privacy Policy"
            subtitle="View privacy policy"
            onPress={() => setShowPrivacyModal(true)}
            containerStyles='rounded-lg mb-[6px]'
          />
          <Text className="mx-8 mb-[38px]">View privacy policy</Text>
        </View>

        <View>
          {/* Copyright */}
          <LegalListItem
            label="Copyright"
            onPress={() => {}}
            containerStyles='rounded-t-lg'
            disabled
          />
          {/* Data Providers */}
          <LegalListItem
            label="Data Providers"
            onPress={() => {}}
            disabled
          />
          {/* Location Information */}
          <LegalListItem
            label="Location information"
            onPress={() => {}}
            containerStyles='rounded-b-lg'
            disabled
          />
        </View>
      </ScrollView>
      <TermsOfUseModal
        visible={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
      <PrivacyPolicyModal
        visible={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />
    </SafeAreaView>
  );
};

interface LegalListItemProps {
  label: string;
  subtitle?: string;
  onPress: () => void;
  containerStyles?: string;
  disabled?: boolean;
}

const LegalListItem: React.FC<LegalListItemProps> = ({ 
  label, 
  subtitle, 
  onPress, 
  containerStyles = "",
  disabled
}) => {
  return (
    <TouchableOpacity 
      onPress={disabled ? undefined : onPress}
      className={`flex-row items-center justify-between p-[12px] px-[16px] bg-white mx-4 border-b border-gray-100 ${containerStyles}`}
      disabled={disabled}
      style={disabled ? { opacity: 0.5 } : undefined}
    >
      <View className="flex-1">
        <Text className="text-base font-medium" style={{ color: disabled ? '#BFBFC3' : '#303031' }}>
          {label}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={disabled ? '#BFBFC3' : '#bfbfc3'} />
    </TouchableOpacity>
  );
};

export default LegalScreen;
