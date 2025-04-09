// src/components/ChatInput.tsx
import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';

interface ChatInputProps {
	newMessage: string;
	setNewMessage: (text: string) => void;
	handleSendMessage: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
	newMessage,
	setNewMessage,
	handleSendMessage,
}) => {
	return (
		<View className="flex-row p-2 items-center rounded-full bg-neutral-200 m-4">
			<TextInput
				value={newMessage}
				onChangeText={setNewMessage}
				placeholder="Message..."
				placeholderTextColor="#aaa"
				className="flex-1 p-2 ml-2 bg-transparent"
			/>
			<TouchableOpacity
				onPress={handleSendMessage}
				className="bg-neutral-400 rounded-full items-center justify-center ml-2 w-8 h-8" // Adjusted margin
			>
				<Text className="text-neutral-200 font-bold text-lg">→</Text>
			</TouchableOpacity>
		</View>
	);
};

export default ChatInput;
