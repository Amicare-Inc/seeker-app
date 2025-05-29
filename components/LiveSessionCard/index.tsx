import React, { useRef, useState } from 'react';
import { View, Dimensions, PanResponder, LayoutAnimation, Platform, UIManager, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LiveSessionCardProps } from '@/types/LiveSession';
import LiveSessionHeader from './LiveSessionHeader';
import { useSessionManager } from '@/hooks/useSessionManager';
import LiveSessionTimer from './LiveSessionTimer';

const { width } = Dimensions.get('window');

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const LiveSessionCard: React.FC<LiveSessionCardProps> = ({ session, onExpand, onCollapse }) => {
  const [expanded, setExpanded] = useState(false);
  const expandedRef = useRef(expanded);
  
  const {
    status,
    elapsedTime,
    userConfirmed,
    otherUserConfirmed,
    confirmSession,
    isCurrentUser,
  } = useSessionManager(session);

  // Add debug logging
  console.log('LiveSessionCard - Current Status:', status);
  console.log('LiveSessionCard - User Confirmed:', userConfirmed);
  // console.log('LiveSessionCard - Session:', session);

  // Keep ref in sync with state
  React.useEffect(() => {
    expandedRef.current = expanded;
  }, [expanded]);

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

  const renderSessionControls = () => {
    // Add debug logging
    console.log('renderSessionControls - Current status:', status);
    console.log('renderSessionControls - Should show buttons:', status === 'ready' && !userConfirmed);
    
    // Only show controls in ready state
    if (status !== 'ready') {
      return null;
    }

    // Show start button if user hasn't confirmed yet
    if (!userConfirmed) {
      return (
        <View className="flex-row justify-between items-center px-4 mt-4">
          <TouchableOpacity 
            onPress={() => {
              console.log('Start button pressed');
              confirmSession();
            }}
            className="bg-white px-6 py-2 rounded-full"
          >
            <Text className="text-green-600 font-semibold">Start Now</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => {
              console.log('Message button pressed');
              /* Handle message */
            }}
            className="bg-black/20 px-6 py-2 rounded-full"
          >
            <Text className="text-white">Message</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // If user has confirmed, just show the message button
    return (
      <View className="flex-row justify-end px-4 mt-4">
        <TouchableOpacity 
          onPress={() => {
            console.log('Message button pressed');
            /* Handle message */
          }}
          className="bg-black/20 px-6 py-2 rounded-full"
        >
          <Text className="text-white">Message</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderStatusInfo = () => {
    // Only show status info in ready state
    if (status !== 'ready') {
      return null;
    }

    return (
      <View className="mt-4 px-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-white">Your status: {userConfirmed ? 'Ready' : 'Waiting'}</Text>
          <Text className="text-white">Other user: {otherUserConfirmed ? 'Ready' : 'Waiting'}</Text>
        </View>
      </View>
    );
  };

  return (
    <View
      className="absolute left-0 right-0 bottom-0"
      style={{
        width,
        zIndex: 50,
      }}
      {...panResponder.panHandlers}
    >
      <LinearGradient
        colors={['#4ade80', '#22c55e']} // Light green to darker green
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
        <LiveSessionHeader
          enrichedSession={session}
          expanded={expanded}
          onToggle={() => setExpanded(!expanded)}
        />
        
        <View className="px-4 mt-2">
          <LiveSessionTimer
            status={status}
            elapsedTime={elapsedTime}
            startTime={session.startTime || ''}
            endTime={session.endTime || ''}
            note={status === 'waiting' ? 'Session starts' : ''}
          />
        </View>

        {renderSessionControls()}
        {renderStatusInfo()}

        {expanded && status === 'started' && (
          <View className="mt-4 px-4">
            <View className="flex-row justify-between items-center">
              <TouchableOpacity 
                onPress={() => {/* Handle message */}}
                className="bg-black/20 px-6 py-2 rounded-full"
              >
                <Text className="text-white">Message</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => {/* Handle emergency */}}
                className="bg-red-500 px-6 py-2 rounded-full"
              >
                <Text className="text-white">Emergency</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </LinearGradient>
    </View>
  );
};

export default LiveSessionCard; 