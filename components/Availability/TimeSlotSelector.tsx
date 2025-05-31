import React from 'react';
import { View, Text } from 'react-native';
import CustomButton from '@/components/Global/CustomButton';

interface TimeSlotSelectorProps {
	activeDay: string;
	selectedTimes: string[];
	timeslots: string[];
	onTimeToggle: (time: string) => void;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
	activeDay,
	selectedTimes,
	timeslots,
	onTimeToggle,
}) => (
	<View>
		<Text className="text-lg font-bold text-black mb-4">
			At roughly what times do you need care for {activeDay}? Select all
			that apply:
		</Text>
		<View className="flex-wrap flex-row justify-between">
			{timeslots.map((time) => (
				<CustomButton
					key={time}
					title={time}
					handlePress={() => onTimeToggle(time)}
					containerStyles={`w-[48%] mb-4 py-4 rounded-full ${
						selectedTimes.includes(time)
							? 'bg-blue-500'
							: 'bg-gray-200'
					}`}
					textStyles={`text-sm ${
						selectedTimes.includes(time)
							? 'text-white'
							: 'text-black'
					}`}
				/>
			))}
		</View>
	</View>
);

export default TimeSlotSelector;
