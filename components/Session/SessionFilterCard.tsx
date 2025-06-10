import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchFilteredUsers } from '@/services/node-express-backend/user';

const { width } = Dimensions.get('window');

const daysOfWeek = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'];
const dayMapping: { [key: string]: string } = {
  Mon: 'Monday',
  Tues: 'Tuesday',
  Wed: 'Wednesday',
  Thurs: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
  Sun: 'Sunday',
};

const SessionFilterCard = ({ onClose }: { onClose: () => void }) => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const slideAnim = useRef(new Animated.Value(300)).current;

  // Slide up animation when the filter card is opened
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  const toggleDay = (shortDay: string) => {
    const fullDay = dayMapping[shortDay];
    setSelectedDays((prev) =>
      prev.includes(fullDay)
        ? prev.filter((d) => d !== fullDay)
        : [...prev, fullDay]
    );
  };

  const handleApply = async () => {
    try {
      if (selectedDays.length === 0) {
        console.log('No days selected');
        return;
      }

      const users = await fetchFilteredUsers(selectedDays);
      console.log('Filtered users:', users);

      // TODO: Handle filtered users (e.g., update UI, pass to parent, store in global state)
      onClose();
    } catch (error) {
      console.error('Error applying filter:', error);
    }
  };

  const slideUpStyle = {
    transform: [{ translateY: slideAnim }],
  };

  return (
    <Animated.View
      style={[
        slideUpStyle,
        {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'white',
          width,
          zIndex: 50,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingTop: 20,
          paddingBottom: 100,
          paddingHorizontal: 25,
        },
      ]}
    >
      {/* Header */}
      <Text className="text-black text-xl font-bold mb-5">Filter by...</Text>

      {/* Days Available */}
      <Text className="text-black text-lg font-medium mb-3">Days Available</Text>
      <View className="flex-wrap flex-row gap-2">
        {daysOfWeek.map((shortDay) => (
          <TouchableOpacity
            key={shortDay}
            onPress={() => toggleDay(shortDay)}
            className={`px-4 py-2 rounded-full ${
              selectedDays.includes(dayMapping[shortDay]) ? 'bg-brand-blue' : 'bg-grey-0'
            }`}
          >
            <Text
              className={`text-base font-medium ${
                selectedDays.includes(dayMapping[shortDay]) ? 'text-white' : 'text-black'
              }`}
            >
              {shortDay}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Apply Button */}
      <TouchableOpacity
        onPress={handleApply}
        className="mt-10 bg-black rounded-xl py-3 items-center"
      >
        <Text className="text-white text-xl font-medium">Apply</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default SessionFilterCard;
