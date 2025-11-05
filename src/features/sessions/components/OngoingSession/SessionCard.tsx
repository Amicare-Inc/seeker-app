import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, PanResponder, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { EnrichedSession } from '@/types/EnrichedSession';
import { formatTimeRange } from '@/lib/datetimes/datetimeHelpers';
import { router } from 'expo-router';
import { useAcceptSession, useRejectSession } from '@/features/sessions/api/queries';
import { formatDate } from '@/lib/datetimes/datetimeHelpers';
import SessionChecklistBox from './SessionChecklistBox';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Alert } from 'react-native';

const { width } = Dimensions.get('window');

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SessionCard = (enrichedSession: EnrichedSession) => {
    const [expanded, setExpanded] = React.useState(false);
    const expandedRef = useRef(expanded);

    const acceptSessionMutation = useAcceptSession();
    const rejectSessionMutation = useRejectSession();
    const currentUser = useSelector((state: RootState) => state.user.userData);

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
        } else if (expandedRef.current && gestureState.dy > 60) {
            LayoutAnimation.easeInEaseOut();
            setExpanded(false);
        }
        },
    })
    ).current;

    const handleAccept = async () => {
        // Create confirmation data to pass to the confirmation page
        const confirmationData = {
            receiverName: enrichedSession.otherUser?.firstName ? 
                `${enrichedSession.otherUser.firstName} ${enrichedSession.otherUser.lastName}` : 
                'Unknown',
            rate: enrichedSession.otherUser?.rate || '25',
            total: enrichedSession.billingDetails?.total?.toFixed(2) || '0.00',
            sessionId: enrichedSession.id,
            sessionData: enrichedSession
        };
        
        router.push({ 
            pathname: '/session-application', 
            params: { 
                otherUserId: enrichedSession.otherUser?.id || '',
                sessionData: JSON.stringify(confirmationData)
            } 
        });
    };

    const handleReject = async () => {
        try {
            await rejectSessionMutation.mutateAsync(enrichedSession.id);
            router.back();
        } catch (err) {
            console.error('Error rejecting session:', err);
        }
    };

    const note = enrichedSession.note ?? 'Appointment';
    const totalCost = enrichedSession.billingDetails?.total?.toFixed(2) ?? 'N/A';

    const dateLabel = enrichedSession.startTime
        ? formatDate(enrichedSession.startTime)
        : 'Invalid Date';

    const timeRange =
        enrichedSession.startTime && enrichedSession.endTime
            ? formatTimeRange(enrichedSession.startTime, enrichedSession.endTime)
            : 'Invalid Time';

    const startDate = enrichedSession.startTime ? new Date(enrichedSession.startTime) : null;
    const endDate = enrichedSession.endTime ? new Date(enrichedSession.endTime) : null;
    const isNextDay =
        startDate && endDate
            ? endDate.getDate() !== startDate.getDate()
            : false;

    const handleToggle = () => {
        LayoutAnimation.easeInEaseOut();
        setExpanded((prev) => !prev);
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
        colors={['#05549e', '#0c7ae2', '#399cf9']} // dark-blue, brand-blue, light-blue
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0.5 }}   // left
        end={{ x: 1, y: 0.5 }}     // right
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

        {/* Header (Touchable) */}
        <TouchableOpacity onPress={handleToggle} activeOpacity={1} className="flex-row items-center">
          <View className="flex-col px-5 pb-7 pt-3 flex-1">
            <Text className="text-white text-lg font-bold">
              Care Type:{" "}
              <Text className="font-normal">
                {enrichedSession.note && enrichedSession.note.length > 12
                  ? `${enrichedSession.note.slice(0, 23)}...`
                  : enrichedSession.note}
              </Text>
            </Text>
            {!expanded && (
                <View className="flex-row items-center">
                    <Text className="text-white text-base">{dateLabel}</Text>
                    <Text className="text-xs text-green-400 ml-2">{`${isNextDay ? '+1' : ''}`}</Text>
                    {/* Show distance for PSWs */}
                    {currentUser?.isPsw && enrichedSession.distanceInfo && (
                        <Text className="text-white text-sm ml-4">
                            • {enrichedSession.distanceInfo.distance}
                        </Text>
                    )}
                </View>
            )}
          </View>

            <Ionicons name="calendar-outline" size={32} color="#fff" style={{ position: 'absolute', right: 25, top: 15 }} />

        </TouchableOpacity>

        {/* Expanded Content */}
        {expanded && (
          <>
            {/* Distance info for PSWs - shown under Care Type header */}
            {currentUser?.isPsw && enrichedSession.distanceInfo && (
              <View className="px-5 mb-3">
                <Text className="text-white text-sm">
                  Distance: {enrichedSession.distanceInfo.distance}
                </Text>
              </View>
            )}
            
            {/* Date & Time Row */}
            <View className="flex-row justify-between items-center bg-transparent rounded-full border border-white px-6 py-2.5 mb-4 mx-5 mt-2">
              <View className="flex-row items-center">
                <Ionicons name="calendar-outline" size={24} color="#fff" />
                <Text className="text-white ml-2 text-[17px] font-medium">{dateLabel}</Text>
                <Text className="text-xs text-green-400 ml-2">{`${isNextDay ? '+1' : ''}`}</Text>
              </View>
              <View
                style={{ width: 1, height: 28 }}
                className="bg-neutral-100"
              />
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={24} color="#fff" />
                <Text className="text-white ml-2 text-[17px] font-medium">{timeRange}</Text>
              </View>
            </View>

            <SessionChecklistBox checklist={enrichedSession.checklist ?? []} editable={false} />

            {/* Price Breakdown */}
            <View className="mb-3 px-5">
              <View className="flex-row justify-between mb-1.5">
                <Text className="text-white/90 text-[14px] font-semibold">Base Price (${enrichedSession.otherUser?.rate})</Text>
                <Text className="text-white/90 text-[14px] font-semibold">{enrichedSession.billingDetails?.basePrice.toFixed(2)}</Text>
              </View>
              <View className="flex-row justify-between mb-1.5">
                <Text className="text-white/90 text-[14px] font-semibold">Taxes</Text>
                <Text className="text-white/90 text-[14px] font-semibold">${enrichedSession.billingDetails?.taxes.toFixed(2)}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-white/90 text-[14px] font-semibold">Service Fee</Text>
                <Text className="text-white/90 text-[14px] font-semibold">${enrichedSession.billingDetails?.serviceFee.toFixed(2)}</Text>
              </View>
            </View>

            {/* Status & Total */}
            <View className="flex-row items-center mb-4 px-5">
              <Text className="text-white ml-1.5 text-[14px] font-semibold">Accept to unlock chat</Text>
              <View className="flex-1" />
              <Text className="text-white text-[14px] font-semibold">
                Total Cost: <Text className="font-bold">${enrichedSession.billingDetails?.total.toFixed(2)}</Text>
              </Text>
            </View>

            {/* Buttons */}
            <View className="flex-row gap-3 mb-2 px-5">
              <TouchableOpacity 
                onPress={handleAccept} 
                className="flex-1 bg-white py-2 rounded-lg items-center"
                disabled={acceptSessionMutation.isPending}
              >
                <Text className="text-black text-base font-medium">
                  {acceptSessionMutation.isPending ? 'Applying...' : 'Apply'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleReject} 
                className="flex-1 bg-black py-2 rounded-lg items-center"
                disabled={rejectSessionMutation.isPending}
              >
                <Text className="text-white text-base font-medium">
                  {rejectSessionMutation.isPending ? 'Rejecting...' : 'Reject'}
                </Text>
              </TouchableOpacity>
            </View>
            {/* <TouchableOpacity className="bg-black/30 py-1.5 rounded-full items-center mx-auto w-[35%] mt-3 mb-2">
              <Text className="text-white text-[14px]">Third Action???</Text>
            </TouchableOpacity> */}
          </>
        )}
      </LinearGradient>
    </View>
  );
};

export default SessionCard;