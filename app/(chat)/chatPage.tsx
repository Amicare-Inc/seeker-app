import React, { useState, useEffect } from 'react';
import { SafeAreaView, FlatList, View, Text, TextInput, Button, KeyboardAvoidingView, Platform } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebase.config';
import { addDoc, collection, query, orderBy, onSnapshot } from 'firebase/firestore';  // Firebase imports
import { Message } from '@/types/Message';  // Your Message interface
import { useLocalSearchParams } from 'expo-router';
import { User } from '@/types/User';

const ChatPage = () => {
  // Get sessionId from the route params (passed from PswSessionsTab)
  const { sessionId, user } = useLocalSearchParams();
  const otherUser: User = JSON.parse(user as string)
  const localparams = useLocalSearchParams()
  console.log("CHATPAGE ALL PARAMS: ",localparams)

  // State to hold all messages
  const [messages, setMessages] = useState<Message[]>([]);

  // State for new message input
  const [newMessage, setNewMessage] = useState('');

  // Get the current user's ID from Firebase Auth
  const currentUserId = FIREBASE_AUTH.currentUser?.uid;
  console.log("IN CHATPAGE of ", FIREBASE_AUTH.currentUser?.email, "OPPOSITE is ", otherUser.firstName)

  // Fetch and listen to messages for this session in real-time
  useEffect(() => {
    if (sessionId) {
      // Call fetchMessages and pass a callback to update the messages state
      const unsubscribe = fetchMessages(sessionId as string, (fetchedMessages: Message[]) => {
        setMessages(fetchedMessages); // Set the fetched messages to state
      });

      // Cleanup the listener when the component unmounts
      return () => unsubscribe();
    }
  }, [sessionId]);

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (newMessage.trim() && currentUserId && sessionId) {
      try {
        await addMessage(sessionId as string, newMessage.trim(), currentUserId); // Send the message
        setNewMessage(''); // Clear the input after sending
      } catch (error) {
        console.error("Failed to send message: ", error);
      }
    }
  };

  // Fetch messages function
  const fetchMessages = (sessionId: string, callback: (messages: Message[]) => void) => {
    const messagesRef = collection(FIREBASE_DB, 'sessions', sessionId, 'messages');
    const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));  // Order by ascending timestamp

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const fetchedMessages: Message[] = snapshot.docs.map(doc => ({
        ...doc.data(),  // Spread all other data fields
        id: doc.id,  // Explicitly add the id field from the document
      })) as Message[];

      callback(fetchedMessages);  // Pass fetched messages to callback
    });

    return unsubscribe;  // Return the unsubscribe function to stop listening when unmounted
  };

  // Add message function
  const addMessage = async (sessionId: string, messageText: string, userId: string) => {
    const messagesRef = collection(FIREBASE_DB, 'sessions', sessionId, 'messages');
    await addDoc(messagesRef, {
      userId,
      message: messageText,
      sessionId,
      timestamp: new Date().toISOString(),  // Add a timestamp
    });
  };

  // Render a message item in the FlatList
  const renderMessage = ({ item }: { item: Message }) => (
    <View style={{ padding: 10, backgroundColor: item.userId === currentUserId ? '#DCF8C6' : '#FFF', marginVertical: 5, borderRadius: 10 }}>
      <Text style={{ fontWeight: 'bold' }}>{item.userId === currentUserId ? 'You' : otherUser.firstName}</Text>
      <Text>{item.message}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}  // Adjust if needed
      >
        <Text className="text-lg font-bold mt-14">Chat with {otherUser.firstName} {otherUser.lastName} </Text>
        {/* Message List */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ padding: 10 }}
          // inverted  // Makes sure the latest message appears at the bottom
        />

        {/* Input for new message */}
        <View style={{ flexDirection: 'row', padding: 10 }}>
          <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 20 }}
          />
          <Button title="Send" onPress={handleSendMessage} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatPage;