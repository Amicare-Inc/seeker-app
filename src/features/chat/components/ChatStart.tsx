import React from 'react';
import { View, Text } from 'react-native';
import { User } from '@/types/User';

interface ChatStartProps {
    user: User;
}

const ChatStart: React.FC<ChatStartProps> = ({ user }) => {
    const userName = user.firstName || 'User';

    return (
        <View className="bg-white border border-grey-9 my-2 p-2 px-4 rounded-xl mx-auto w-fit">
            <Text className="text-grey-80 text-xs text-center leading-4 tracking-tight">
                You are chatting with {userName}.{'\n'}
                Chats are private, stored with your session,{'\n'}
                and visible only to you and {userName}.
            </Text>
        </View>
    );
};

export default ChatStart;