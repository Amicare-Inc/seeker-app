// src/components/ChatMessageList.tsx
import React from 'react';
import { FlatList, View, Text } from 'react-native';
import { Message } from '@/types/Message';

interface ChatMessageListProps {
	messages: Message[];
	otherUserName: string;
	currentUserId: string;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({
	messages,
	otherUserName,
	currentUserId,
}) => {
	const renderItem = ({ item }: { item: Message }) => {
		return (
			<View
				className={`p-3 my-1 rounded-lg max-w-3/4 ${item.userId === currentUserId ? 'self-end bg-blue-500' : 'self-start bg-gray-200'}`}
			>
				<Text
					className={`font-bold ${item.userId === currentUserId ? 'text-white' : 'text-black'}`}
				>
					{item.userId === currentUserId ? 'You' : otherUserName}
				</Text>
				<Text
					className={`${item.userId === currentUserId ? 'text-white' : 'text-black'}`}
				>
					{item.message}
				</Text>
			</View>
	)};

	return (
		<FlatList
			data={messages}
			keyExtractor={(item) => item.id}
			renderItem={renderItem}
			contentContainerStyle={{ padding: 16 }}
		/>
	);
};

export default ChatMessageList;
