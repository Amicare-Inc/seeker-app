import React from 'react';
import CustomButton from '@/components/CustomButton';
import { View } from 'react-native';

interface DaySelectorProps {
	days: string[];
	selectedDays: { [day: string]: string[] };
	activeDay: string | null;
	onDayToggle: (day: string) => void;
	onReset: () => void;
}

const DaySelector: React.FC<DaySelectorProps> = ({
	days,
	selectedDays,
	activeDay,
	onDayToggle,
	onReset,
}) => (
	<View className="flex-wrap flex-row justify-between mb-6">
		{days.map((day) => (
			<CustomButton
				key={day}
				title={day}
				handlePress={() => onDayToggle(day)}
				containerStyles={`w-[22%] py-4 rounded-full ${selectedDays[day]?.length ? 'bg-blue-500' : 'bg-gray-200'}`}
				textStyles={`text-sm ${selectedDays[day]?.length ? 'text-white' : 'text-black'}`}
			/>
		))}

		{/* Reset Button */}
		<CustomButton
			title="Reset"
			handlePress={onReset}
			containerStyles="w-[22%] py-4 bg-red-500 rounded-full"
			textStyles="text-sm text-white"
		/>
	</View>
);

export default DaySelector;
