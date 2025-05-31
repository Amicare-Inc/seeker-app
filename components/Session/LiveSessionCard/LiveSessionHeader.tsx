import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { LiveSessionHeaderProps } from '@/types/LiveSession';

const LiveSessionHeader: React.FC<LiveSessionHeaderProps> = ({
  enrichedSession,
  expanded,
  onToggle,
  formatTimeUntilSession
}) => {
  if(!enrichedSession) return null;
  const otherUser = enrichedSession.otherUser;
  
  // Use first value before comma as main label, like SessionBookedList
  const mainLabel = enrichedSession.note ? enrichedSession.note.split(',')[0].trim() : '';
  const countdown = formatTimeUntilSession ? formatTimeUntilSession(enrichedSession.startTime) : '';

  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={1}>
      <View className="flex-row items-start px-5 py-2">
        <Image
          source={{ uri: otherUser?.profilePhotoUrl || 'https://via.placeholder.com/50' }}
          className="w-12 h-12 rounded-full mr-3"
        />
        
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text className="text-black text-[19px] font-bold" numberOfLines={expanded ? undefined : 1} ellipsizeMode="tail">
              {expanded ? enrichedSession.note : (mainLabel.length > 13 ? `${mainLabel.substring(0, 13)}...` : mainLabel)} {enrichedSession.liveStatus === 'upcoming' && !expanded && countdown ? `in ${countdown}` : ''}
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