// src/components/ChatInput.tsx
import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';

interface ChatInputProps {
  newMessage: string;
  setNewMessage: (text: string) => void;
  handleSendMessage: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ newMessage, setNewMessage, handleSendMessage }) => {
  return (
    <View className="flex-row p-4 items-center">
      <TextInput
        value={newMessage}
        onChangeText={setNewMessage}
        placeholder="Type a message..."
        placeholderTextColor="#ccc"
        className="flex-1 border border-gray-300 p-3 rounded-full bg-gray-100 mr-3"
      />
      <TouchableOpacity onPress={handleSendMessage} className="bg-blue-500 p-3 rounded-full items-center justify-center">
        <Text className="text-white font-bold">Send</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChatInput;