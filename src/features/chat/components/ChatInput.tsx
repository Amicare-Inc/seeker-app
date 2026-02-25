// src/components/ChatInput.tsx
import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';

interface ChatInputProps {
    newMessage: string;
    setNewMessage: (text: string) => void;
    handleSendMessage: () => void;
    onFocusChange?: (isFocused: boolean) => void; // Add this prop
}

const ChatInput: React.FC<ChatInputProps> = ({
    newMessage,
    setNewMessage,
    handleSendMessage,
    onFocusChange,
}) => {
    // Handle focus and blur events
    const handleFocus = () => {
        if (onFocusChange) {
            onFocusChange(true); // Call parent with true when focused
        }
    };

    const handleBlur = () => {
        if (onFocusChange) {
            onFocusChange(false); // Call parent with false when blurred
        }
    };

    return (
        <View className="flex-row p-2 items-center rounded-full bg-neutral-200 w-[95%] mx-auto">
            <TextInput
                value={newMessage}
                onChangeText={setNewMessage}
                placeholder="Message..."
                placeholderTextColor="#aaa"
                className="flex-1 p-2 ml-2 bg-transparent"
                onFocus={handleFocus}
                onBlur={handleBlur}
                returnKeyType="send"
                onSubmitEditing={handleSendMessage}
            />
            <TouchableOpacity
                onPress={handleSendMessage}
                disabled={newMessage.trim().length === 0}
                className={`rounded-full items-center justify-center ml-2 w-8 h-8 ${newMessage.trim().length > 0 ? 'bg-[#1A8BF8]' : 'bg-neutral-400'}`}
            >
                <Text style={{ lineHeight: 20 }} className={`${newMessage.trim().length > 0 ? 'text-white' : 'text-neutral-200'} font-bold text-lg text-center`}>→</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ChatInput;