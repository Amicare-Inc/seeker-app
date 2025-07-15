import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const NotificationSettingsScreen = () => {
  const [activityConnections, setActivityConnections] = useState(true);
  const [remindersAlerts, setRemindersAlerts] = useState(true);
  const [ongoingSessionUpdates, setOngoingSessionUpdates] = useState(true);
  const [securityCompliance, setSecurityCompliance] = useState(true);
  const [offersAnnouncements, setOffersAnnouncements] = useState(true);

  const handleBackPress = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      {/* Header */}
      <View className="flex-row items-center px-4 mb-[28px]">
        <TouchableOpacity onPress={handleBackPress} className="mr-4 absolute left-4">
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-xl font-medium">Notification Settings</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Activity & Connections */}
        <NotificationItem
          title="Activity & Connections"
          description="Session Requests (received, accepted, declined), Messages, Profile likes, Changes to session requests."
          value={activityConnections}
          onValueChange={setActivityConnections}
        />

        {/* Reminders & Alerts */}
        <NotificationItem
          title="Reminders & Alerts"
          description="Upcoming session reminder, caregiver arriving soon, session feedback due"
          value={remindersAlerts}
          onValueChange={setRemindersAlerts}
        />

        {/* Ongoing Session Updates */}
        <NotificationItem
          title="Ongoing Session Updates"
          description="Session started, task completed, checklist updated, session extended, session ended"
          value={ongoingSessionUpdates}
          onValueChange={setOngoingSessionUpdates}
        />

        {/* Security & Compliance */}
        <NotificationItem
          title="Security & Compliance"
          description="ID Verification complete/failed, suspicious log-in"
          value={securityCompliance}
          onValueChange={setSecurityCompliance}
        />

        {/* Offers & Announcements */}
        <NotificationItem
          title="Offers & Announcements"
          description="Promotions (Special rates, seasonal deals), feature launches, policy updates"
          value={offersAnnouncements}
          onValueChange={setOffersAnnouncements}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

interface NotificationItemProps {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
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

export default NotificationSettingsScreen;
