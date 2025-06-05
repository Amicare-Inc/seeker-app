import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SessionChecklistProps {
	onChange: (tasks: string) => void;
}

const SessionChecklist: React.FC<SessionChecklistProps> = ({ onChange }) => {
	const [tasks, setTasks] = useState<string[]>([]);
	const [inputValue, setInputValue] = useState<string>(''); // State for the text input

	const addTask = (task: string) => {
		if (task.trim() && !tasks.includes(task.trim())) {
			const updatedTasks = [...tasks, task.trim()];
			setTasks(updatedTasks);
			onChange(updatedTasks.join(', '));
			setInputValue(''); // Clear the text field
			Keyboard.dismiss(); // Close the keyboard
		}
	};

	const removeTask = (task: string) => {
		const updatedTasks = tasks.filter((t) => t !== task);
		setTasks(updatedTasks);
		onChange(updatedTasks.join(', '));
	};

	return (
		<View className="mb-4">
			<Text className="text-lg font-bold mb-2">Session Checklist</Text>
            <Text className="text-base mb-4">List all the specific tasks you would like accomplished during your session</Text>
                <TextInput
                    className="p-3 pl-5 text-base bg-grey-0 rounded-full"
                    placeholder="e.g. Drive me to medical appt. "
                    placeholderTextColor="#7B7B7E"
                    value={inputValue}
                    onChangeText={setInputValue}
                    onSubmitEditing={(event) => addTask(event.nativeEvent.text)} 
                />
			<View className="flex-wrap flex-row mt-3">
				{tasks.map((task) => (
					<View
						key={task}
						className="flex-row items-center justify-between bg-grey-0 rounded-full px-3 py-2 mr-2 mb-2"
					>
                        <TouchableOpacity onPress={() => removeTask(task)}>
							<Text className="text-[12px] mr-1">X</Text>
						</TouchableOpacity>
						<Text className="text-base">{task}</Text>

					</View>
				))}
			</View>
		</View>
	);
};

export default SessionChecklist;
