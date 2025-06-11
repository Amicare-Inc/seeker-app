import React, { useState } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	TextInput,
	Platform,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface DatePickerFieldProps {
	title: string;
	value: string;
	onDateChange: (date: string) => void;
	otherStyles?: string;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
	title,
	value,
	onDateChange,
	otherStyles,
}) => {
	const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

	const handleConfirm = (date: Date) => {
		const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date
			.getDate()
			.toString()
			.padStart(2, '0')}/${date.getFullYear()}`;
		onDateChange(formattedDate);
		setDatePickerVisibility(false);
	};

	return (
		<View className={otherStyles}>
			<TouchableOpacity
				onPress={() => setDatePickerVisibility(true)}
				activeOpacity={0.9}
			>
				<View className="w-full h-12 px-4 bg-white rounded-lg flex flex-row items-center">
					<TextInput
						className="flex-1 text-black font-medium text-base"
						value={value}
						placeholder={title}
						placeholderTextColor="#9D9DA1"
						editable={false}
						pointerEvents="none" // Ensures the TouchableOpacity handles the tap
					/>
				</View>
			</TouchableOpacity>

			<DateTimePickerModal
				isVisible={isDatePickerVisible}
				mode="date"
				onConfirm={handleConfirm}
				onCancel={() => setDatePickerVisibility(false)}
				maximumDate={new Date()}
				// display={Platform.OS === 'ios' ? 'inline' : 'default'} // For faster response on iOS
			/>
		</View>
	);
};

export default DatePickerField;
