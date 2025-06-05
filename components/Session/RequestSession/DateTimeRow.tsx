import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface DateTimeRowProps {
	label: string;
	dateLabel: string;
	timeLabel: string;
	onPressDate: () => void;
	onPressTime: () => void;
	disabled: boolean;
}

const DateTimeRow: React.FC<DateTimeRowProps> = ({
	label,
	dateLabel,
	timeLabel,
	onPressDate,
	onPressTime,
	disabled = false,
}) => {
	return (
			<View className="flex-row mb-4 items-center gap-5 justify-between">
				<Text className="text-base text-grey-35 font-semibold mb-2">{label}</Text>
				<View className="flex-row">
					<TouchableOpacity
						onPress={onPressDate}
						disabled={disabled}
						className={`mr-2 p-2 px-4 bg-grey-0 rounded-lg items-center ${disabled ? 'bg-gray-200' : ''}`}
					>
						<Text className="text-base font-semibold">{dateLabel}</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={onPressTime}
						disabled={disabled}
						className={`p-2 px-4 bg-grey-0 rounded-lg items-center ${disabled ? 'bg-gray-200' : ''}`}
					>
						<Text className="text-base font-semibold">{timeLabel}</Text>
					</TouchableOpacity>
				</View>
			</View>
	);
};

export default DateTimeRow;
