import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const VerifyFeedbackScreen = () => {
  const handleBackPress = () => {
    router.back();
  };

  const handleFeedbackPress = () => {
    router.push('/(profile)/settings/security-privacy/verify/final'); // Navigate to the verify-final route
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      {/* Header */}
      <View className="flex-row items-center px-4">
        <TouchableOpacity onPress={handleBackPress} className="mr-4 absolute left-4">
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-xl font-medium">Delete Account</Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="mx-4 mt-10">
          <Text className="text-xl font-semibold">Feedback</Text>
          <Text className="text-base mt-4">
            Before we proceed, would you mind telling us why you’re leaving so we can improve?
          </Text>
        </View>

        {/* Feedback List Items */}
        <View className="bg-white rounded-lg mx-4 mt-6">
          <FeedbackListItem label="Bad experience with a session" onPress={handleFeedbackPress} />
          <FeedbackListItem label="It’s too expensive" onPress={handleFeedbackPress} />
          <FeedbackListItem label="No longer need account" onPress={handleFeedbackPress} />
          <FeedbackListItem label="No longer support company" onPress={handleFeedbackPress} />
          <FeedbackListItem label="Prefer not to say" onPress={handleFeedbackPress} />
          <FeedbackListItem label="Other" onPress={handleFeedbackPress} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

interface FeedbackListItemProps {
  label: string; // Only takes a label string
  onPress: () => void; // Function to handle press
}

const FeedbackListItem: React.FC<FeedbackListItemProps> = ({ label, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} className="flex-row items-center p-4 py-5">
      <Text className="flex-1 text-base text-grey-80 font-medium">{label}</Text>
      <Ionicons name="chevron-forward" size={20} color="#bfbfc3" />
    </TouchableOpacity>
  );
};

export default VerifyFeedbackScreen;