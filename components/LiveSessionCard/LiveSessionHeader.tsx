import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { LiveSessionHeaderProps } from '@/types/LiveSession';
import { getTimeUntilStart } from '@/scripts/datetimeHelpers';

const LiveSessionHeader: React.FC<LiveSessionHeaderProps> = ({
  enrichedSession,
  expanded,
  onToggle
}) => {
  if(!enrichedSession) return null;
  const otherUser = enrichedSession.otherUser;
  const timeUntilStart = getTimeUntilStart(enrichedSession.startTime || '');

  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={1}>
      <View className="flex-row items-start px-5 py-2">
        <Image
          source={{ uri: otherUser?.profilePhotoUrl || 'https://via.placeholder.com/50' }}
          className="w-12 h-12 rounded-full mr-3"
        />
        
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text className="text-black text-[19px] font-bold flex-1">
              {enrichedSession.note} in {timeUntilStart}
            </Text>
          </View>
          <Text className="text-black text-[15px]">
            with {otherUser?.firstName}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default LiveSessionHeader;