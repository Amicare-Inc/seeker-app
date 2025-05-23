import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, PanResponder, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import CalendarIcon from '../assets/icons/calendar.svg';
import ClockIcon from '../assets/icons/clock-session-card.svg';

const { width } = Dimensions.get('window');

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SessionCard = () => {
  const [expanded, setExpanded] = React.useState(false);
  const expandedRef = useRef(expanded);

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
          <View className="flex-col px-5 pb-2 pt-3 flex-1">
            <Text className="text-white text-[19px] font-bold">
              Session Confirmed: <Text className="font-normal">Medical Appt.</Text>
            </Text>
            {!expanded && (
              <Text className="text-white text-base">Wed, 30 Oct.</Text>
            )}
          </View>
          {!expanded && (
            <CalendarIcon width={32} height={32} style={{ position: 'absolute', right: 25, top: 15 }} />
          )}
        </TouchableOpacity>

        {/* Expanded Content */}
        {expanded && (
          <>
            {/* Date & Time Row */}
            <View className="flex-row justify-between items-center bg-transparent rounded-full border border-white px-6 py-2.5 mb-4 mx-5 mt-2">
              <View className="flex-row items-center">
                <CalendarIcon width={24} height={24}/>
                <Text className="text-white ml-2 text-[17px] font-medium">Wed, 30 Oct</Text>
              </View>
              <View
                style={{ width: 1, height: 28 }}
                className="bg-neutral-100"
              />
              <View className="flex-row items-center">
                <ClockIcon width={24} height={24}/>
                <Text className="text-white ml-2 text-[17px] font-medium">10:00 - 11:00</Text>
              </View>
            </View>
            {/* Price Breakdown */}
            <View className="mb-3 px-5">
              <View className="flex-row justify-between mb-1.5">
                <Text className="text-white/90 text-[14px] font-semibold">Base Price (156/hr)</Text>
                <Text className="text-white/90 text-[14px] font-semibold">$156.00</Text>
              </View>
              <View className="flex-row justify-between mb-1.5">
                <Text className="text-white/90 text-[14px] font-semibold">Taxes</Text>
                <Text className="text-white/90 text-[14px] font-semibold">$24.20</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-white/90 text-[14px] font-semibold">Service Fee</Text>
                <Text className="text-white/90 text-[14px] font-semibold">$40.00</Text>
              </View>
            </View>

            {/* Status & Total */}
            <View className="flex-row items-center mb-4 px-5">
              <Ionicons name="checkmark-circle" size={20} color="#4ade80" />
              <Text className="text-white ml-1.5 text-[14px] font-semibold">Session Booked</Text>
              <View className="flex-1" />
              <Text className="text-white text-[14px] font-semibold">
                Total Cost: <Text className="font-bold">$230.20</Text>
              </Text>
            </View>

            {/* Buttons */}
            <View className="flex-row gap-3 mb-2 px-5">
              <TouchableOpacity className="flex-1 bg-white py-2 rounded-lg items-center">
                <Text className="text-black text-base font-medium">Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-black py-2 rounded-lg items-center">
                <Text className="text-white text-base font-medium">Cancel</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity className="bg-black/30 py-1.5 rounded-full items-center mx-auto w-[35%] mt-3 mb-2">
              <Text className="text-white text-[14px]">Third Action???</Text>
            </TouchableOpacity>
          </>
        )}
      </LinearGradient>
    </View>
  );
};

export default SessionCard;