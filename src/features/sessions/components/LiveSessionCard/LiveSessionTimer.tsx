import React from 'react';
import { View, Text } from 'react-native';
import { LiveSessionTimerProps } from '@/types/LiveSession';
import { formatTimeRange, getTimeUntilStart, formatDuration } from '@/lib/datetimes/datetimeHelpers';

const LiveSessionTimer: React.FC<LiveSessionTimerProps> = ({
  startTime,
  endTime,
  note,
  status,
  elapsedTime
}) => {
  const timeUntilStart = getTimeUntilStart(startTime);
  const sessionDuration = formatTimeRange(startTime, endTime);

  const renderTimerContent = () => {
    switch (status) {
      case 'waiting':
        return (
          <View className="flex-row justify-between items-center">
            <Text className="text-white text-base">
              {note} in {timeUntilStart}
            </Text>
            <Text className="text-white/80 text-sm">
              {sessionDuration}
            </Text>
          </View>
        );
      
      case 'ready':
        return (
          <View className="flex-row justify-between items-center">
            <Text className="text-white text-base">
              Ready to start
            </Text>
            <Text className="text-white/80 text-sm">
              {sessionDuration}
            </Text>
          </View>
        );

      case 'started':
        return (
          <View className="flex-row justify-between items-center">
            <Text className="text-white text-xl font-medium">
              {formatDuration(elapsedTime ?? 0)}
            </Text>
            <Text className="text-white/80">
              {sessionDuration}
            </Text>
          </View>
        );

      default:
        return (
          <View className="flex-row justify-between items-center">
            <Text className="text-white text-base">
              {note} in {timeUntilStart}
            </Text>
            <Text className="text-white/80 text-sm">
              {sessionDuration}
            </Text>
          </View>
        );
    }
  };

  return (
    <View className="w-full">
      {renderTimerContent()}
    </View>
  );
};

export default LiveSessionTimer; 