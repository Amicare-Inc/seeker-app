import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { LiveSessionHeaderProps } from '@/types/LiveSession';
import { formatTimeRange } from '@/scripts/datetimeHelpers';

const LiveSessionHeader: React.FC<LiveSessionHeaderProps> = ({
  enrichedSession,
  expanded,
  onToggle
}) => {
  if(!enrichedSession) return null;
  const otherUser = enrichedSession.otherUser;
  const timeRange = formatTimeRange(enrichedSession.startTime ?? '', enrichedSession.endTime ?? '');

  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={1}>
      <View className="flex-row items-center px-5 py-2">
        <Image
          source={{ uri: otherUser?.profilePhotoUrl || 'https://via.placeholder.com/50' }}
          className="w-12 h-12 rounded-full mr-3"
        />
        
        <View className="flex-1">
          <Text className="text-white text-[17px] font-semibold">
            {enrichedSession.note}
            <Text className="font-normal"> with {otherUser?.firstName}</Text>
          </Text>
          
          {!expanded && (
            <Text className="text-white/90 text-sm">
              {timeRange}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default LiveSessionHeader;