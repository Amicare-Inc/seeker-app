import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
	CARE_TYPE_OPTIONS,
	CARE_TYPE_TO_TASKS,
} from '@/shared/constants/carePreferencesOnboarding';

interface GroupedCareTasksDropdownProps {
	label: string;
	initialTasks: string[];
	onTasksChange: (tasks: string[]) => void;
	triggerClassName?: string;
}

/**
 * Single multi-select: "Seeking help with" (or PSW: "Assisting with"),
 * options grouped under the same category headings as onboarding.
 */
const GroupedCareTasksDropdown: React.FC<GroupedCareTasksDropdownProps> = ({
	label,
	initialTasks,
	onTasksChange,
	triggerClassName,
}) => {
	const [selectedTasks, setSelectedTasks] = useState<string[]>(() => [
		...initialTasks,
	]);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		setSelectedTasks([...initialTasks]);
	}, [initialTasks.join('\u0001')]);

	useEffect(() => {
		onTasksChange(selectedTasks);
	}, [selectedTasks]);

	const toggleTask = (task: string) => {
		setSelectedTasks((prev) =>
			prev.includes(task) ? prev.filter((t) => t !== task) : [...prev, task],
		);
	};

	const triggerSummary =
		selectedTasks.length === 0
			? 'Select options'
			: selectedTasks.join(', ');

	let optionCount = 0;
	CARE_TYPE_OPTIONS.forEach((c) => {
		optionCount += (CARE_TYPE_TO_TASKS[c] || []).length;
	});

	return (
		<View className="mb-4">
			<Text className="text-sm font-semibold mb-1">{label}</Text>
			<TouchableOpacity
				onPress={() => setIsOpen(!isOpen)}
				className={
					triggerClassName ?? 'p-3 border border-gray-300 rounded-lg'
				}
			>
				<Text className="text-base text-gray-700">{triggerSummary}</Text>
			</TouchableOpacity>
			{isOpen && (
				<View className="mt-2 border border-gray-300 rounded-lg overflow-hidden">
					<ScrollView
						nestedScrollEnabled
						keyboardShouldPersistTaps="handled"
						scrollEnabled={optionCount > 8}
						style={optionCount > 8 ? { maxHeight: 320 } : undefined}
						showsVerticalScrollIndicator={optionCount > 8}
					>
						{CARE_TYPE_OPTIONS.map((category) => (
							<View key={category}>
								<Text className="text-xs font-bold text-gray-600 uppercase tracking-wide px-3 pt-3 pb-1 bg-gray-100">
									{category}
								</Text>
								{(CARE_TYPE_TO_TASKS[category] || []).map((item) => (
									<TouchableOpacity
										key={item}
										onPress={() => toggleTask(item)}
										className="p-3 border-b border-gray-200 flex-row items-center justify-between"
									>
										<Text className="text-base">{item}</Text>
										{selectedTasks.includes(item) && (
											<Ionicons name="checkmark" size={20} color="green" />
										)}
									</TouchableOpacity>
								))}
							</View>
						))}
					</ScrollView>
					<TouchableOpacity
						onPress={() => setIsOpen(false)}
						className="p-3 bg-gray-100 border-t border-gray-200"
					>
						<Text className="text-center text-base font-semibold text-[#0c7ae2]">
							Done
						</Text>
					</TouchableOpacity>
				</View>
			)}
		</View>
	);
};

export default GroupedCareTasksDropdown;
