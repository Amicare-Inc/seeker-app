import React, { useRef, useState } from 'react';
import { View, Dimensions, PanResponder, LayoutAnimation, Platform, UIManager, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LiveSessionCardProps } from '@/types/LiveSession';
import LiveSessionHeader from './LiveSessionHeader';
import { useSessionManager } from '@/hooks/useSessionManager';
import { Feather } from '@expo/vector-icons';
import { formatDate, formatTimeRange } from '@/scripts/datetimeHelpers';
import { router } from 'expo-router';
import { useDispatch } from 'react-redux';
import { setActiveEnrichedSession } from '@/redux/sessionSlice';

const { width } = Dimensions.get('window');

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const formatTimeUntilSession = (startTime: string | undefined | null): string => {
  if (!startTime) return '';
  const now = new Date();
  const start = new Date(startTime);
  const diff = start.getTime() - now.getTime();
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

const LiveSessionCard: React.FC<LiveSessionCardProps> = ({ session, onExpand, onCollapse }) => {
  const [expanded, setExpanded] = useState(false);
  const expandedRef = useRef(expanded);
  const dispatch = useDispatch();
  
  const {
    status,
    userConfirmed,
    otherUserConfirmed,
    confirmSession,
    isCurrentUser,
  } = useSessionManager(session);

  // Keep ref in sync with state
  React.useEffect(() => {
    expandedRef.current = expanded;
  }, [expanded]);

  const handleMessagePress = () => {
    dispatch(setActiveEnrichedSession(session));
    router.push({
      pathname: '/(chat)/[sessionId]',
      params: { sessionId: session.id }
    });
  };

  // PanResponder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 10,
      onPanResponderRelease: (_, gestureState) => {
        if (!expandedRef.current && gestureState.dy < -60) {
          LayoutAnimation.easeInEaseOut();
          setExpanded(true);
          onExpand?.();
        } else if (expandedRef.current && gestureState.dy > 60) {
          LayoutAnimation.easeInEaseOut();
          setExpanded(false);
          onCollapse?.();
        }
      },
    })
  ).current;

  const dateLabel = session.startTime ? formatDate(session.startTime) : 'Invalid Date';
  const timeRange = formatTimeRange(session.startTime || '', session.endTime || '');
  const startDate = session.startTime ? new Date(session.startTime) : null;
  const endDate = session.endTime ? new Date(session.endTime) : null;
  const isNextDay = startDate && endDate ? endDate.getDate() !== startDate.getDate() : false;

  const renderSessionControls = () => {
    // Add debug logging
    console.log('renderSessionControls - Current status:', status);
    
    if (session.liveStatus === 'upcoming') {
      return (
        <View className="flex-row justify-between items-center mx-5">
          <TouchableOpacity 
            onPress={handleMessagePress}
            className="bg-black/20 py-2 px-4 rounded-full"
          >
            <Text className="text-white text-center">Message</Text>
          </TouchableOpacity>
          <View className="flex-row items-center">
            <Feather name="clock" size={20} color="black" className="mr-2" />
            <Text className="text-black">
              {formatTimeUntilSession(session.startTime)}
            </Text>
          </View>
        </View>
      );
    }

    // Show Start button for ready state
    if (session.liveStatus === 'ready') {
      if (!expanded) {
        // Collapsed state - show Start button on the right
        return (
          <View className="flex-row justify-between items-center mx-5">
            <Text className="text-black flex-1">{session.note}</Text>
            <TouchableOpacity 
              onPress={confirmSession}
              className={`py-3 px-6 rounded-lg mr-5 ${userConfirmed ? 'border border-black bg-transparent' : 'bg-white'}`}
            >
              <Text className="text-black font-medium text-[17px] text-center">
                {userConfirmed ? 'Waiting' : 'Start'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      } else {
        // Expanded state - show Message and Start buttons side by side
        return (
          <View className="flex-row justify-between items-center mx-5">
            <TouchableOpacity 
              onPress={handleMessagePress}
              className="bg-black/20 py-2 px-4 rounded-full"
            >
              <Text className="text-white text-center">Message</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={confirmSession}
              className={`py-3 px-6 rounded-lg ml-3 ${userConfirmed ? 'border border-black bg-transparent' : 'bg-white'}`}
            >
              <Text className="text-black font-medium text-[17px] text-center">
                {userConfirmed ? 'Waiting' : 'Start Now'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      }
    }

    return null;
  };

  const renderStatusInfo = () => {
    // Only show status info in ready state
    if (status !== 'ready') {
      return null;
    }

    return (
      <View className="mt-4 px-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-black">Your status: {userConfirmed ? 'Ready' : 'Waiting'}</Text>
          <Text className="text-black">Other user: {otherUserConfirmed ? 'Ready' : 'Waiting'}</Text>
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: Platform.OS === 'ios' ? 83 : 64,
        width,
        transform: [{ translateY: expanded ? 0 : 0 }],
      }}
      {...panResponder.panHandlers}
    >
      <LinearGradient
        colors={['#4ade80', '#22c55e']}
        locations={[0, 1]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={{
          borderTopLeftRadius: expanded ? 24 : 0,
          borderTopRightRadius: expanded ? 24 : 0,
          paddingTop: expanded ? 16 : 8,
          paddingBottom: expanded ? 16 : 8,
          shadowColor: '#000',
          shadowOpacity: 0.15,
          shadowRadius: 10,
          elevation: 10,
        }}
      >
        {/* Handle Bar */}
        {expanded && (
          <View
            style={{
              position: 'absolute',
              top: 8,
              left: 0,
              right: 0,
              alignItems: 'center',
              zIndex: 10,
            }}
            pointerEvents="none"
          >
            <View
              style={{
                width: 56,
                height: 3,
                borderRadius: 3,
                backgroundColor: 'rgba(0,0,0,0.35)',
              }}
            />
          </View>
        )}

        {/* Collapsed State */}
        {!expanded && (
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <LiveSessionHeader
                enrichedSession={session}
                expanded={expanded}
                onToggle={() => {
                  LayoutAnimation.easeInEaseOut();
                  setExpanded(!expanded);
                  if (!expanded) {
                    onExpand?.();
                  } else {
                    onCollapse?.();
                  }
                }}
                formatTimeUntilSession={formatTimeUntilSession}
              />
            </View>
            
            {/* Start button on right for ready state */}
            {session.liveStatus === 'ready' && (
              <TouchableOpacity 
                onPress={confirmSession}
                className={`py-3 px-6 rounded-lg mr-5 ${userConfirmed ? 'border border-black bg-transparent' : 'bg-white'}`}
              >
                <Text className="text-black font-medium text-[17px] text-center">
                  {userConfirmed ? 'Waiting' : 'Start'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Expanded State */}
        {expanded && (
          <>
            <LiveSessionHeader
              enrichedSession={session}
              expanded={expanded}
              onToggle={() => {
                LayoutAnimation.easeInEaseOut();
                setExpanded(!expanded);
                if (!expanded) {
                  onExpand?.();
                } else {
                  onCollapse?.();
                }
              }}
              formatTimeUntilSession={formatTimeUntilSession}
            />

            {/* Date & Time Row */}
            <View className="flex-row justify-between items-center bg-transparent rounded-full border border-black px-6 py-2.5 mb-4 mx-5 mt-2">
              <View className="flex-row items-center">
                <Feather name="calendar" size={24} color="black" />
                <Text className="text-black ml-2 text-[17px] font-medium">{dateLabel}</Text>
                <Text className="text-xs text-black ml-2">{`${isNextDay ? '+1' : ''}`}</Text>
              </View>
              <View
                style={{ width: 1, height: 28 }}
                className="bg-black"
              />
              <View className="flex-row items-center">
                <Feather name="clock" size={24} color="black" />
                <Text className="text-black ml-2 text-[17px] font-medium">{timeRange}</Text>
              </View>
            </View>

            {/* Button Row */}
            <View className="flex-row justify-between items-center mx-5 mt-4">
              {session.liveStatus === 'ready' ? (
                <>
                  <TouchableOpacity 
                    onPress={confirmSession}
                    className={`py-3 px-6 rounded-lg flex-1 mr-2 ${userConfirmed ? 'border border-black bg-transparent' : 'bg-white'}`}
                  >
                    <Text className="text-black font-medium text-center text-[17px]">
                      {userConfirmed ? 'Waiting' : 'Start Now'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={handleMessagePress}
                    className="bg-black py-3 px-6 rounded-lg flex-1 ml-2"
                  >
                    <Text className="text-white font-medium text-center text-[17px]">
                      Message
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity 
                  onPress={handleMessagePress}
                  className="bg-black py-3 px-6 rounded-lg flex-1"
                >
                  <Text className="text-white font-medium text-center text-[17px]">
                    Message
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </LinearGradient>
    </View>
  );
};

export default LiveSessionCard; 