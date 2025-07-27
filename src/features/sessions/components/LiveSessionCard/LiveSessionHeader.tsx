import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { LiveSessionHeaderProps } from '@/types/LiveSession';
import { getSessionDisplayInfo } from '@/features/sessions/utils/sessionDisplayUtils';

const LiveSessionHeader: React.FC<LiveSessionHeaderProps> = ({
  enrichedSession,
  expanded,
  onToggle,
  countdown = '' // ✅ Use countdown prop directly
}) => {
  const currentUser = useSelector((state: RootState) => state.user.userData);

  if(!enrichedSession || !currentUser) return null;

  const displayInfo = getSessionDisplayInfo(enrichedSession, currentUser);
  
  // Use first value before comma as main label, like SessionBookedList
  const mainLabel = enrichedSession.note ? enrichedSession.note.split(',')[0].trim() : '';

  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={1}>
      <View className="flex-row items-start px-5 py-2">
        <Image
          source={{ uri: displayInfo.primaryPhoto || 'https://via.placeholder.com/50' }}
          className="w-12 h-12 rounded-full mr-3"
        />
        
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text className="text-black text-[19px] font-bold" numberOfLines={expanded ? undefined : 1} ellipsizeMode="tail">
              {expanded ? enrichedSession.note : (mainLabel.length > 13 ? `${mainLabel.substring(0, 13)}...` : mainLabel)} {enrichedSession.liveStatus === 'upcoming' && !expanded && countdown ? `in ${countdown}` : ''}
            </Text>
          </View>
          <Text className="text-black text-[15px]">
            with {displayInfo.primaryName.split(' ')[0]}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default LiveSessionHeader;