import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import helpOptions from '@/assets/helpOptions';
import { Ionicons } from '@expo/vector-icons';

interface HelpOptionsDropdownProps {
	initialValue?: string; // comma-separated string of options
	onChange: (selected: string) => void;
	disabled?: boolean;
}

const HelpOptionsDropdown: React.FC<HelpOptionsDropdownProps> = ({
	initialValue = '',
	onChange,
	disabled = false,
}) => {
	const [selectedOptions, setSelectedOptions] = useState<string[]>(() => {
		return initialValue
			? initialValue.split(',').map((opt) => opt.trim())
			: [];
	});
	const [isOpen, setIsOpen] = useState<boolean>(false);

	useEffect(() => {
		onChange(selectedOptions.join(', '));
	}, [selectedOptions]);

	const toggleOption = (option: string) => {
		setSelectedOptions((prev) => {
			if (prev.includes(option)) {
				return prev.filter((o) => o !== option);
			} else {
				return [...prev, option];
			}
		});
	};

	const removeOption = (option: string) => {
		setSelectedOptions((prev) => prev.filter((o) => o !== option));
	};

	return (
		<View className="mb-4 border-b pb-3 border-grey-9">
			<TouchableOpacity
				onPress={() => !disabled && setIsOpen((prev) => !prev)}
				className="p-2 pl-5 bg-grey-9 flex-row items-center rounded-lg mb-2"
				style={{
					opacity: disabled ? 0.6 : 1
				}}
				disabled={disabled}
			>
				<Text className="text-base text-grey-49 font-medium flex-1 pr-3">
					I need help with...
				</Text>
				{!disabled && <Ionicons name="arrow-down-circle" size={32} color="#9D9DA1" />}
			</TouchableOpacity>

			{isOpen && !disabled && (
				<View className="mt-2 bg-grey-9 rounded-lg mb-3">
					{helpOptions.map((item, index) => (
						<TouchableOpacity
							key={item}
							onPress={() => {
								toggleOption(item);
							}}
							className={`p-3 flex-row items-center justify-between ${
								index === helpOptions.length - 1
									? '' // No border for the last item
									: 'border-b border-gray-200'
							}`}
						>
							<Text className="text-base">{item}</Text>
							{selectedOptions.includes(item) && (
								<Ionicons name="checkmark" size={20} color="green" />
							)}
						</TouchableOpacity>
					))}
				</View>
			)}
			
			{selectedOptions.length > 0 && (
				<View className="flex-wrap flex-row mt-3">
					{selectedOptions.map((option) => (
						<View
							key={option}
							className="flex-row items-center justify-between bg-white rounded-full px-3 py-2 mr-2 mb-2"
						>
							{!disabled && (
								<TouchableOpacity onPress={() => removeOption(option)}>
									<Text className="text-[12px] mr-2 text-grey-58">X</Text>
								</TouchableOpacity>
							)}
							<Text className="text-sm">{option}</Text>
						</View>
					))}
				</View>
			)}
		</View>
	);
};

export default HelpOptionsDropdown;
