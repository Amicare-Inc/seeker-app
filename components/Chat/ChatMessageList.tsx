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
	const renderItem = ({ item }: { item: Message }) => (
		<View
			className={`p-3 my-1 rounded-3xl max-w-3/4 ${item.userId === currentUserId ? 'self-end bg-[#0e7ae2]' : 'self-start bg-gray-200'}`}
		>
			<Text
				className={`${item.userId === currentUserId ? 'text-white' : 'text-black'} px-1`}
			>
				{item.message}
			</Text>
		</View>
	);

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
