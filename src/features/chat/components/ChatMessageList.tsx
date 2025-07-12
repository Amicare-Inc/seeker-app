import React from 'react';
import { FlatList, View, Text } from 'react-native';
import { Message } from '@/types/Message';
import { User } from '@/types/User';
import ChatStart from './ChatStart';

interface ChatMessageListProps {
    messages: Message[];
    otherUser: User;
    currentUserId: string;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({
    messages,
    otherUser,
    currentUserId,
}) => {
    // Safety deduplication: filter out duplicate IDs
    const uniqueMessages = React.useMemo(() => {
        const seen = new Set<string>();
        return messages.filter(message => {
            if (seen.has(message.id)) {
                return false; // Skip duplicate
            }
            seen.add(message.id);
            return true;
        });
    }, [messages]);

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

    const renderHeader = () => {
        // Only render ChatStart if otherUser exists
        if (!otherUser) return null;
        return <ChatStart user={otherUser} />;
    };

    return (
        <FlatList
            data={uniqueMessages}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListHeaderComponent={renderHeader}
            contentContainerStyle={{ padding: 16 }}
        />
    );
};

export default ChatMessageList;