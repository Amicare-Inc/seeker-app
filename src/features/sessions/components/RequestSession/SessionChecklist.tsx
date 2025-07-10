import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SessionChecklistProps {
  onChange: (tasks: string[]) => void;  // Change from string to string[]
}

const SessionChecklist: React.FC<SessionChecklistProps> = ({ onChange }) => {
	const [tasks, setTasks] = useState<string[]>([]);
	const [inputValue, setInputValue] = useState<string>(''); // State for the text input

	const addTask = (task: string) => {
		if (task.trim() && !tasks.includes(task.trim())) {
			const updatedTasks = [...tasks, task.trim()];
			setTasks(updatedTasks);
			onChange(updatedTasks);
			setInputValue(''); // Clear the text field
			Keyboard.dismiss(); // Close the keyboard
		}
	};

	const removeTask = (task: string) => {
		const updatedTasks = tasks.filter((t) => t !== task);
		setTasks(updatedTasks);
		onChange(updatedTasks);
	};

	return (
		<View className="mb-4">
			<Text className="text-lg font-bold mb-2">Session Checklist</Text>
            <Text className="text-base mb-4 text-grey-80">
                List all the specific tasks you would like accomplished during your session
            </Text>
            <View className="flex-row items-center bg-grey-9 rounded-full p-2 pl-5">
                <TextInput
                    className="flex-1 text-base font-medium"
                    placeholder="e.g. Drive me to medical appt. "
                    placeholderTextColor="#7B7B7E"
                    value={inputValue}
                    onChangeText={setInputValue}
                    onSubmitEditing={(event) => addTask(event.nativeEvent.text)}
                    style={{ paddingRight: 12 }}
                />
                <Ionicons name="arrow-down-circle" size={32} color="#9D9DA1" />
            </View>
			<View className="flex-wrap flex-row mt-3">
				{tasks.map((task) => (
					<View
						key={task}
						className="flex-row items-center justify-between bg-white rounded-full px-3 py-2 mr-2 mb-2"
					>
                        <TouchableOpacity onPress={() => removeTask(task)}>
							<Text className="text-[12px] mr-2 text-grey-58">X</Text>
						</TouchableOpacity>
						<Text className="text-sm">{task}</Text>

					</View>
				))}
			</View>
		</View>
	);
};

export default SessionChecklist;
