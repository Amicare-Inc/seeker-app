import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const LegalScreen = () => {
  const handleBackPress = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
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
            onPress={() => {
              // Navigate to terms & conditions page or open web view
              console.log('Terms & Conditions pressed');
            }}
            containerStyles='rounded-lg mb-[6px]'
          />
          <Text className="mx-8 mb-[38px]">View terms & conditions</Text>
        </View>

        <View>
          {/* Privacy Policy */}
          <LegalListItem
            label="Privacy Policy"
            subtitle="View privacy policy"
            onPress={() => {
              // Navigate to privacy policy page or open web view
              console.log('Privacy Policy pressed');
            }}
            containerStyles='rounded-lg mb-[6px]'
          />
          <Text className="mx-8 mb-[38px]">View privacy policy</Text>
        </View>

        <View>
          {/* Copyright */}
          <LegalListItem
            label="Copyright"
            onPress={() => {
              // Navigate to copyright page or open web view
              console.log('Copyright pressed');
            }}
            containerStyles='rounded-t-lg'
          />
          
          {/* Data Providers */}
          <LegalListItem
            label="Data Providers"
            onPress={() => {
              // Navigate to data providers page or open web view
              console.log('Data Providers pressed');
            }}
          />
          
          {/* Location Information */}
          <LegalListItem
            label="Location information"
            onPress={() => {
              // Navigate to location information page or open web view
              console.log('Location information pressed');
            }}
            containerStyles='rounded-b-lg'
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

interface LegalListItemProps {
  label: string;
  subtitle?: string;
  onPress: () => void;

  containerStyles?: string;
}

const LegalListItem: React.FC<LegalListItemProps> = ({ 
  label, 
  subtitle, 
  onPress, 

  containerStyles = ""
}) => {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      className={`flex-row items-center justify-between p-[12px] px-[16px] bg-white mx-4 border-b border-gray-100 ${containerStyles}`}>
      <View className="flex-1">
        <Text className="text-base text-black font-medium">
          {label}
        </Text>

      </View>
      <Ionicons name="chevron-forward" size={20} color="#bfbfc3" />
    </TouchableOpacity>
  );
};

export default LegalScreen;
