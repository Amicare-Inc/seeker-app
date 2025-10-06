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

	return (
		<View className="mb-4 border-b pb-3 border-grey-9">
			<TouchableOpacity
				onPress={() => !disabled && setIsOpen((prev) => !prev)}
				className="p-2 pl-5 bg-grey-9 flex-row items-center"
				style={{
					borderRadius: Math.max(8, 24 - (selectedOptions.length * 3)),
					opacity: disabled ? 0.6 : 1
				}}
				disabled={disabled}
			>
				<Text className="text-base text-grey-49 font-medium flex-1 pr-3">
					{selectedOptions.length > 0
						? selectedOptions.join(', ')
						: 'I need help with...'}
				</Text>
				{!disabled && <Ionicons name="arrow-down-circle" size={32} color="#9D9DA1" />}
			</TouchableOpacity>
			{isOpen && !disabled && (
				<View className="mt-2 bg-grey-9 rounded-lg">
					{helpOptions.map((item, index) => (
						<TouchableOpacity
							key={item}
							onPress={() => {
								toggleOption(item);
								setIsOpen(false); // close dropdown immediately after selecting
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
		</View>
	);
};

export default HelpOptionsDropdown;
