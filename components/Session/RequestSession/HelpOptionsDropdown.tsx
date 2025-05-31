import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import helpOptions from '@/assets/helpOptions';
import { Ionicons } from '@expo/vector-icons';

interface HelpOptionsDropdownProps {
	initialValue?: string; // comma-separated string of options
	onChange: (selected: string) => void;
}

const HelpOptionsDropdown: React.FC<HelpOptionsDropdownProps> = ({
	initialValue = '',
	onChange,
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
		<View className="mb-4">
			<TouchableOpacity
				onPress={() => setIsOpen((prev) => !prev)}
				className="p-3 border border-gray-300 rounded-lg"
			>
				<Text className="text-base text-gray-700">
					{selectedOptions.length > 0
						? selectedOptions.join(', ')
						: 'Select options'}
				</Text>
			</TouchableOpacity>
			{isOpen && (
				<View className="mt-2 border border-gray-300 rounded-lg">
					<FlatList
						data={helpOptions}
						keyExtractor={(item) => item}
						renderItem={({ item }) => (
							<TouchableOpacity
								onPress={() => {
									toggleOption(item);
									setIsOpen(false); // close dropdown immediately after selecting
								}}
								className="p-3 border-b border-gray-200 flex-row items-center justify-between"
							>
								<Text className="text-base">{item}</Text>
								{selectedOptions.includes(item) && (
									<Ionicons
										name="checkmark"
										size={20}
										color="green"
									/>
								)}
							</TouchableOpacity>
						)}
					/>
				</View>
			)}
		</View>
	);
};

export default HelpOptionsDropdown;
