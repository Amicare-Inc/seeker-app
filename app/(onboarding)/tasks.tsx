import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import CustomButton from '@/components/Global/CustomButton';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { updateUserFields } from '@/redux/userSlice';
import helpOptions from '@/assets/helpOptions';
import { router } from 'expo-router';

const TaskSelection: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const userData = useSelector((state: RootState) => state.user.userData);
	const isPSW = userData?.isPsw;

	const [selectedTasks, setSelectedTasks] = useState<string[]>(
		userData?.carePreferences?.tasks || [],
	);

	// const taskOptions = [
	//     'Option 1',
	//     'Option 2',
	//     'Option 3',
	//     'Option 4',
	//     'Option 5',
	//     'Option 6',
	//     'Option 7',
	//     'Option 8',
	// ];

	const toggleTask = (task: string) => {
		setSelectedTasks((prev) =>
			prev.includes(task)
				? prev.filter((t) => t !== task)
				: [...prev, task],
		);
	};

	const handleNext = () => {
		if (selectedTasks.length > 0) {
			dispatch(
				updateUserFields({
					carePreferences: {
						...userData?.carePreferences,
						tasks: selectedTasks,
					},
				}),
			);
			console.log('Tasks updated in Redux:', selectedTasks, userData);
		}
		router.push('/availability'); // Move to the next page regardless
	};

	return (
		<SafeAreaView className="flex-1 bg-white">
			<ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
				<View className="px-6">
					{/* Dynamic Header Based on Role */}
					<Text className="text-lg font-bold text-black mb-4">
						{isPSW
							? 'What tasks are you able to assist with?'
							: 'What kind of tasks would you like help with?'}
					</Text>

					{/* Task Options */}
					<View className="flex-wrap flex-row justify-between">
						{helpOptions.map((task) => (
							<CustomButton
								key={task}
								title={task}
								handlePress={() => toggleTask(task)}
								containerStyles={`w-full mb-4 py-4 rounded-xl border ${
									selectedTasks.includes(task)
										? 'border-blue-500 bg-blue-500'
										: 'border-gray-200 bg-gray-200'
								}`}
								textStyles={`text-base ${
									selectedTasks.includes(task)
										? 'text-white'
										: 'text-black'
								}`}
							/>
						))}
					</View>
				</View>
			</ScrollView>

			{/* Skip/Next Button */}
			<View className="px-9 pb-0">
				<CustomButton
					title={selectedTasks.length > 0 ? 'Next' : 'Skip'}
					handlePress={handleNext}
					containerStyles="bg-black py-4 rounded-full"
					textStyles="text-white text-lg"
				/>
			</View>
		</SafeAreaView>
	);
};

export default TaskSelection;
