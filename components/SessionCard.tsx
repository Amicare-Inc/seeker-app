import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, PanResponder, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

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
      <View
        className={`bg-[#2D8EFF] shadow-lg px-0 ${expanded ? 'rounded-t-2xl py-4' : ' py-2'}`}
        style={{
          borderTopLeftRadius: expanded ? 24 : 0,
          borderTopRightRadius: expanded ? 24 : 0,
        }}
      >
        {/* Header (Touchable) */}
        <TouchableOpacity onPress={handleToggle} activeOpacity={1}>
          <View className="flex-col mb-2 px-5">
            <Text className="text-white text-xl font-semibold">
              Session Confirmed: <Text className="font-normal">Medical Appt.</Text>
            </Text>
            {!expanded && (
              <Text className="text-white">Wed, 30 Oct.</Text>
            )}
          </View>
        </TouchableOpacity>

        {/* Expanded Content */}
        {expanded && (
          <>
            {/* Date & Time Row */}
            <View className="flex-row justify-between items-center bg-transparent rounded-full border border-white px-7 py-3 mb-3 mx-5 mt-3">
              <View className="flex-row items-center">
                <MaterialIcons name="calendar-today" size={18} color="#fff" />
                <Text className="text-white ml-2 text-base">Wed, 30 Oct</Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={18} color="#fff" />
                <Text className="text-white ml-2 text-base">10:00 - 11:00</Text>
              </View>
            </View>
            {/* Price Breakdown */}
            <View className="mb-2 px-5">
              <View className="flex-row justify-between mb-1">
                <Text className="text-white/90 text-base">Base Price (156/hr)</Text>
                <Text className="text-white/90 text-base">$156.00</Text>
              </View>
              <View className="flex-row justify-between mb-1">
                <Text className="text-white/90 text-base">Taxes</Text>
                <Text className="text-white/90 text-base">$24.20</Text>
              </View>
              <View className="flex-row justify-between mb-1">
                <Text className="text-white/90 text-base">Service Fee</Text>
                <Text className="text-white/90 text-base">$40.00</Text>
              </View>
            </View>

            {/* Status & Total */}
            <View className="flex-row items-center mb-4 px-5">
              <Ionicons name="checkmark-circle" size={20} color="#4ade80" />
              <Text className="text-white ml-2 text-base">Session Booked</Text>
              <View className="flex-1" />
              <Text className="text-white text-base font-medium">
                Total Cost: <Text className="font-bold text-lg">$230.20</Text>
              </Text>
            </View>

            {/* Buttons */}
            <View className="flex-row gap-3 mb-2 px-5">
              <TouchableOpacity className="flex-1 bg-white py-3 rounded-xl items-center">
                <Text className="text-black text-base font-medium">Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-black py-3 rounded-xl items-center">
                <Text className="text-white text-base font-medium">Cancel</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity className="bg-black/30 py-1 rounded-full items-center mx-auto w-2/5 my-3">
              <Text className="text-white text-base">Third Action???</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default SessionCard;