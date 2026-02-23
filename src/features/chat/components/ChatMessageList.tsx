import React, { useEffect, useRef } from 'react';
import { FlatList, View, Text } from 'react-native';
import { Message } from '@/types/Message';
import { User } from '@/types/User';
import ChatStart from './ChatStart';

interface ChatMessageListProps {
    messages: Message[];
    otherUser: User;
    currentUserId: string;
    isKeyboardVisible?: boolean;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({
    messages,
    otherUser,
    currentUserId,
    isKeyboardVisible,
}) => {
    const flatListRef = useRef<FlatList>(null);

    // Safety deduplication: filter out duplicate IDs
    const uniqueMessages = React.useMemo(() => {
        const seen = new Set<string>();
        return messages.filter(message => {
            if (!message) return false; // Safety check
            if (seen.has(message.id)) {
                return false; // Skip duplicate
            }
            seen.add(message.id);
            return true;
        });
    }, [messages]);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (uniqueMessages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 10);
        }
    }, [uniqueMessages]);

    // Auto-scroll to bottom when component mounts (chat opens)
    useEffect(() => {
        if (uniqueMessages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: false });
            }, 100);
        }
    }, []);

    // Auto-scroll when keyboard becomes visible
    useEffect(() => {
        if (isKeyboardVisible && uniqueMessages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [isKeyboardVisible, uniqueMessages.length]);

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
            ref={flatListRef}
            data={uniqueMessages}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListHeaderComponent={renderHeader}
            contentContainerStyle={{ padding: 16 }}
        />
    );
};

export default ChatMessageList;