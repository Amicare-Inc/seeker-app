import React, { useRef, useState, useEffect } from 'react';
import { View, Dimensions, PanResponder, LayoutAnimation, Platform, UIManager, TouchableOpacity, Text, Keyboard, Animated, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LiveSessionCardProps } from '@/types/LiveSession';
import LiveSessionHeader from './LiveSessionHeader';
import { useSessionManager } from '@/hooks/useSessionManager';
import { Feather, Ionicons } from '@expo/vector-icons';
import { formatDate, formatTimeRange } from '@/scripts/datetimeHelpers';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveEnrichedSession } from '@/redux/sessionSlice';
import SessionChecklistBox from '../OngoingSession/SessionChecklistBox';
import { RootState } from '@/redux/store';
import { updateSessionChecklist, addSessionComment } from '@/services/node-express-backend/session';
import { ChecklistItem } from '@/types/Sessions';

const { width } = Dimensions.get('window');

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function formatTime(secs: number) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return [h, m, s].map(n => n.toString().padStart(2, '0')).join(':');
}

function formatSessionDuration(startTime: string, endTime: string): string {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationMs = end.getTime() - start.getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours} hr, ${minutes} min`;
  }
  return `${minutes} min`;
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
  const [timer, setTimer] = useState(0);
  const bottomOffset = useRef(new Animated.Value(Platform.OS === 'ios' ? 83 : 64)).current;
  const expandedRef = useRef(expanded);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user.userData);
  
  const {
    status,
    elapsedTime,
    userConfirmed,
    otherUserConfirmed,
    userEndConfirmed,
    otherUserEndConfirmed,
    confirmSession,
    confirmEndSession,
  } = useSessionManager(session);

  // Keep ref in sync with state
  React.useEffect(() => {
    expandedRef.current = expanded;
  }, [expanded]);

  // Keyboard listeners with smooth animation
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      Animated.timing(bottomOffset, {
        toValue: e.endCoordinates.height,
        duration: e.duration || 250,
        useNativeDriver: false,
      }).start();
    });
    
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', (e) => {
      Animated.timing(bottomOffset, {
        toValue: Platform.OS === 'ios' ? 83 : 64,
        duration: e.duration || 250,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, [bottomOffset]);

  // Timer effect - calculate elapsed time from liveStatusUpdatedAt
  useEffect(() => {
    if (session.liveStatus === 'started' && session.liveStatusUpdatedAt) {

      const updateTimer = () => {
        const now = new Date();
        // Handle Firebase Timestamp conversion
        const timestamp = session.liveStatusUpdatedAt!;
        
        let startTime: Date;
        if ((timestamp as any)?._seconds !== undefined) {
          // Firebase timestamp format: convert _seconds and _nanoseconds to Date
          const seconds = (timestamp as any)._seconds;
          const nanoseconds = (timestamp as any)._nanoseconds || 0;
          const milliseconds = seconds * 1000 + nanoseconds / 1000000;
          startTime = new Date(milliseconds);
        } else if ((timestamp as any)?.toDate) {
          // Standard Firebase Timestamp with toDate method
          startTime = (timestamp as any).toDate();
        } else {
          // Fallback for string timestamps
          startTime = new Date(timestamp);
        }
        
        if (isNaN(startTime.getTime())) {
          console.log('Invalid start time, setting timer to 0');
          setTimer(0);
          return;
        }
        
        const elapsedSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setTimer(Math.max(0, elapsedSeconds));
      };

      // Update immediately
      updateTimer();
      
      // Then update every second
      timerRef.current = setInterval(updateTimer, 1000);
    } else {
      console.log('Timer debug - conditions not met:', {
        liveStatus: session.liveStatus,
        liveStatusUpdatedAt: session.liveStatusUpdatedAt
      });
      setTimer(0); // Reset timer if not started or no start time
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [session.liveStatus, session.liveStatusUpdatedAt]);

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

  const handleExpand = () => {
    LayoutAnimation.easeInEaseOut();
    setExpanded(true);
    onExpand?.();
  };

  const handleCollapse = () => {
    LayoutAnimation.easeInEaseOut();
    setExpanded(false);
    onCollapse?.();
  };

  // PSW checklist validation
  const validatePSWChecklist = () => {
    if (!currentUser?.isPsw || !session.checklist) {
      return true; // Not a PSW or no checklist, allow end session
    }
    
    const incompleteTasks = session.checklist.filter(item => !item.checked);
    return incompleteTasks.length === 0;
  };

  const handleEndSessionPress = () => {
    if (currentUser?.isPsw && session.checklist) {
      const isChecklistComplete = validatePSWChecklist();
      if (!isChecklistComplete) {
        Alert.alert(
          'Incomplete Checklist',
          'Please make sure all tasks in the checklist are completed before ending the session.',
          [{ text: 'OK', style: 'default' }]
        );
        return;
      }
    }
    
    confirmEndSession();
  };

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: bottomOffset,
        width,
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

            {/* End session button for ending state */}
            {session.liveStatus === 'ending' && (
              <View className="flex-row items-center mr-5">
                <TouchableOpacity 
                  onPress={handleEndSessionPress}
                  className={`py-3 px-6 rounded-lg mr-2 ${userEndConfirmed ? 'border border-black bg-transparent' : 'bg-white'}`}
                >
                  <Text className="text-black font-medium text-[17px] text-center">
                    {userEndConfirmed ? 'Waiting' : 'End'}
                  </Text>
                </TouchableOpacity>
                {(userEndConfirmed && otherUserEndConfirmed) && (
                  <View className="w-6 h-6 rounded-full bg-white items-center justify-center">
                    <Ionicons name="checkmark" size={16} color="#000" />
                  </View>
                )}
              </View>
            )}

            {/* Timer display for started sessions */}
            {session.liveStatus === 'started' && (
              <View className="items-end mr-5">
                <Text className="text-black text-[20px] font-bold">
                  {formatTime(timer)}
                </Text>
                <Text className="text-black text-[16px]">{formatSessionDuration(session.startTime!, session.endTime!)}</Text>
              </View>
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
            {(session.liveStatus === 'ready' || session.liveStatus === 'upcoming') ? (<View className="flex-row justify-between items-center bg-transparent rounded-full border border-black px-6 py-2.5 mb-4 mx-5 mt-2">
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
            </View>) : (
              	<View >
              		<SessionChecklistBox 
                    checklist={session.checklist || []} 
                    comments={session.comments || []}
                    editable={currentUser!.isPsw ? true : false}
                    showComment={currentUser!.isPsw ? true : false}
                    currentUserId={currentUser?.id}
                    onChecklistUpdate={async (checklist: ChecklistItem[]) => {
                      try {
                        await updateSessionChecklist(session.id, checklist);
                      } catch (error) {
                        console.error('Error updating checklist:', error);
                      }
                    }}
                    onCommentAdd={async (comment: string) => {
                      try {
                        if (currentUser?.id) {
                          await addSessionComment(session.id, comment, currentUser.id);
                        }
                      } catch (error) {
                        console.error('Error adding comment:', error);
                      }
                    }}
                  />
            	</View>
            )}

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
              ) : session.liveStatus === 'ending' ? (
                <>
                  <TouchableOpacity 
                    onPress={handleEndSessionPress}
                    className={`py-3 px-6 rounded-lg flex-1 mr-2 ${userEndConfirmed ? 'border border-black bg-transparent' : 'bg-white'}`}
                  >
                    <Text className="text-black font-medium text-center text-[17px]">
                      {userEndConfirmed ? 'Waiting' : 'End Session'}
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
                  {(userEndConfirmed && otherUserEndConfirmed) && (
                    <View className="w-8 h-8 rounded-full bg-white items-center justify-center ml-2">
                      <Ionicons name="checkmark" size={20} color="#000" />
                    </View>
                  )}
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
    </Animated.View>
  );
};

export default LiveSessionCard; 