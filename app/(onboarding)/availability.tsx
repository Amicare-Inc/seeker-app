import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import DaySelector from '@/components/Availability/DaySelector';
import TimeSlotSelector from '@/components/Availability/TimeSlotSelector';
import CustomButton from '@/components/CustomButton';
import { useAvailability } from '@/hooks/useAvailability';

const days = ['Mon', 'Tues', 'Weds', 'Thurs', 'Fri', 'Sat', 'Sun'];
const timeslots = [
  '6 am - 9 am',
  '9 am - 12 pm',
  '12 pm - 3 pm',
  '3 pm - 6 pm',
  '6 pm - 9 pm',
  '9 pm - 12 am',
  '12 am - 3 am',
  '3 am - 6 am',
];

const AvailabilityPage: React.FC = () => {
  const {
    selectedDays,
    activeDay,
    toggleDay,
    toggleTime,
    resetAvailability,
    saveAvailability,
  } = useAvailability();

  // Check if at least one time slot is selected
  const hasSelectedTimes = Object.values(selectedDays).some(times => times.length > 0);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
        <View className={`p-6 ${!activeDay ? 'flex-1 justify-center' : ''}`}>
          <Text className="text-lg font-bold text-black mb-4 text-center">
            On which days do you usually need care? Select all that apply:
          </Text>

          <DaySelector
            days={days}
            selectedDays={selectedDays}
            activeDay={activeDay}
            onDayToggle={toggleDay}
            onReset={resetAvailability}
          />

          {activeDay && (
            <TimeSlotSelector
              activeDay={activeDay}
              selectedTimes={selectedDays[activeDay] || []}
              timeslots={timeslots}
              onTimeToggle={toggleTime}
            />
          )}
        </View>
      </ScrollView>

      <View className="p-6">
        <CustomButton
          title={hasSelectedTimes ? 'Next' : 'Skip'}
          handlePress={saveAvailability}
          containerStyles="w-full bg-black py-4 rounded-full"
          textStyles="text-white text-lg"
        />
      </View>
    </SafeAreaView>
  );
};

export default AvailabilityPage;