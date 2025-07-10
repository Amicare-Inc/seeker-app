import React, { useState } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	TextInputProps,
	Platform,
} from 'react-native';
// import DateTimePicker from "@react-native-community/datetimepicker";

interface ForumFieldProps extends TextInputProps {
	title: string;
	value: string;
	handleChangeText: (e: string) => void;
	otherStyles?: string;
	isDateField?: boolean;
}

const ForumField: React.FC<ForumFieldProps> = ({
	title,
	value,
	handleChangeText,
	otherStyles,
	isDateField = false,
	...props
}) => {
	const [showPassword, setShowPassword] = useState(false);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [date, setDate] = useState(new Date());

	const handleDateChange = (event: any, selectedDate?: Date) => {
		setShowDatePicker(Platform.OS === 'ios');
		if (selectedDate) {
			setDate(selectedDate);
			const formattedDate = `${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}/${selectedDate.getDate().toString().padStart(2, '0')}/${selectedDate.getFullYear()}`;
			handleChangeText(formattedDate);
		}
	};

	return (
		<View className={otherStyles}>
			<TouchableOpacity
				className="w-full h-12 px-4 bg-gray-100 rounded-lg flex flex-row items-center"
				onPress={() => isDateField && setShowDatePicker(true)}
				activeOpacity={isDateField ? 0.7 : 1}
			>
				{isDateField ? (
					<Text className="flex-1 text-black font-normal text-base">
						{value || title}
					</Text>
				) : (
					<TextInput
						className="flex-1 text-black font-medium text-base"
						value={value}
						placeholder={title}
						placeholderTextColor="#9D9DA1"
						onChangeText={handleChangeText}
						secureTextEntry={
							(title === 'Password' ||
								title === 'Confirm Password') &&
							!showPassword
						}
						{...props}
					/>
				)}
			</TouchableOpacity>

			{/* {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
        />
      )} */}
		</View>
	);
};

export default ForumField;
