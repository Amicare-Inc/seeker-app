import React, { useRef, useState, useEffect } from 'react';
import { View, Dimensions, PanResponder, LayoutAnimation, Platform, UIManager, TouchableOpacity, Text, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LiveSessionCardProps } from '@/types/LiveSession';
import LiveSessionHeader from './LiveSessionHeader';
import { useSessionManager, useCountdownTimer } from '@/features/sessions/hooks';
import { Feather, Ionicons } from '@expo/vector-icons';
import { formatDate, formatTimeRange } from '@/lib/datetimes/datetimeHelpers';
import { router } from 'expo-router';
import { useSelector } from 'react-redux';
import { useActiveSession } from '@/lib/context/ActiveSessionContext';
import SessionChecklistBox from '../OngoingSession/SessionChecklistBox';
import { RootState } from '@/redux/store';
import { updateSessionChecklist, addSessionComment } from '@/features/sessions/api/sessionApi';
import { ChecklistItem } from '@/types/Sessions';
import { useElapsedTimer } from '@/features/sessions/hooks';
import { LiveStatus } from '@/shared/constants/enums';
import { TermsOfUseLink, TermsOfUseModal } from '@/features/privacy/components/TermsOfUseModal';

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

function formatSessionDuration(startTime: string, endTime: string) {
  return formatTimeRange(startTime, endTime);
}

// ✅ Remove the static formatTimeUntilSession function - replaced with useCountdownTimer hook

const LiveSessionCard: React.FC<LiveSessionCardProps> = ({ session, onExpand, onCollapse }) => {
  const [expanded, setExpanded] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  
  const expandedRef = useRef(expanded);
  const timer = useElapsedTimer(session.liveStatus, session.liveStatusUpdatedAt);
  const { setActiveEnrichedSession } = useActiveSession();
  const currentUser = useSelector((state: RootState) => state.user.userData);
  
  // ✅ Add real-time countdown timer
  const { countdown } = useCountdownTimer(session.startTime, session.liveStatus);
  
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

  const handleMessagePress = () => {
    setActiveEnrichedSession(session);
    router.push({
      pathname: '/(chat)/[sessionId]',
      params: { sessionId: session.id }
    });
  };

  // Force complete session and navigate to session-completed page
  const handleForceCompleteSession = () => {
    // Set the session as completed in context
    setActiveEnrichedSession({
      ...session,
      status: 'completed',
      liveStatus: 'completed'
    });
    
    // Navigate to session completed page
    router.push({
      pathname: '/(chat)/session-completed',
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

  const handleStartSession = () => {
    if (!hasPermission) {
      Alert.alert(
        'Checkbox Required',
        'Please confirm you understand before starting this session.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }
    confirmSession();
  };

  return (
    <View
      style={{
        width,
        marginBottom: 0,
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
                countdown={countdown}
              />
            </View>
            
            {/* Start button on right for ready state */}
            {session.liveStatus === LiveStatus.Ready && (
              <TouchableOpacity 
                onPress={handleStartSession}
                className={`py-3 px-6 rounded-lg mr-5 ${userConfirmed ? 'border border-black bg-transparent' : 'bg-white'}`}
              >
                <Text className="text-black font-medium text-[17px] text-center">
                  {userConfirmed ? 'Waiting' : 'Start'}
                </Text>
              </TouchableOpacity>
            )}

            {/* End session button for ending state */}
            {session.liveStatus === LiveStatus.Ending && (
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
            {session.liveStatus === LiveStatus.Started && (
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
                             countdown={countdown}
            />

            {/* Date & Time Row */}
            {(session.liveStatus === LiveStatus.Ready || session.liveStatus === LiveStatus.Upcoming) ? (<View className="flex-row justify-between items-center bg-transparent rounded-full border border-black px-6 py-2.5 mb-4 mx-5 mt-2">
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
              {session.liveStatus === LiveStatus.Ready ? (
                <>
                  <TouchableOpacity 
                    onPress={handleStartSession}
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
              ) : session.liveStatus === LiveStatus.Ending ? (
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
            
            {/* Permission Checkbox - only show for Ready status */}
            {session.liveStatus === LiveStatus.Ready && (
              <TouchableOpacity 
                className="flex-row items-start mx-5 mt-4"
                onPress={() => setHasPermission(!hasPermission)}
              >
                <View className={`w-5 h-5 mr-3 mt-0.5 rounded border items-center justify-center ${
                  hasPermission ? 'bg-black border-black' : 'border-black'
                }`}>
                  {hasPermission && (
                    <Ionicons name="checkmark" size={14} color="white" />
                  )}
                </View>
                <Text className="text-[11px] text-black flex-1 leading-[14px]">
                  By starting, you confirm the session details are correct and agree Amicare is not the care provider. Care is delivered solely by your selected caregiver as an independent contractor. See{' '}
                  <TermsOfUseLink
                    textStyle={{ fontSize: 11, fontWeight: '500', color: '#000' }}
                    onPress={() => setShowTermsModal(true)}
                  />
                  .
                </Text>
              </TouchableOpacity>
            )}
            
            {/* Force Complete Button (for testing) */}
            {/* <View className="mx-5 mt-2">
              <TouchableOpacity 
                onPress={handleForceCompleteSession}
                className="bg-gray-200 py-2 px-4 rounded-lg self-center"
              >
                <Text className="text-gray-800 text-[13px]">
                  Force Complete (Testing)
                </Text>
              </TouchableOpacity>
            </View> */}
          </>
        )}
      </LinearGradient>
      
      <TermsOfUseModal
        visible={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
    </View>
  );
};

export default LiveSessionCard; 