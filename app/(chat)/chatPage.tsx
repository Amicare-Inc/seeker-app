import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
  Keyboard,
} from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebase.config';
import { addDoc, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useLocalSearchParams } from 'expo-router';
import { Message } from '@/types/Message';
import { Session } from '@/types/Sessions';
import { User } from '@/types/User';

const ChatHeader: React.FC<{
  session: Session;
  user: User;
  isExpanded: boolean;
  toggleExpanded: () => void;
}> = ({ session, user, isExpanded, toggleExpanded }) => {

  return(
  <TouchableOpacity
    onPress={toggleExpanded}
    style={{
      backgroundColor: '#f9f9f9',
      padding: 16,
      borderBottomWidth: isExpanded ? 1 : 0,
      borderBottomColor: '#ccc',
    }}
  >
    {/* Initial Header */}
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: isExpanded ? 16 : 0 }}>
      <Image
        source={{ uri: user.profilePhotoUrl || 'https://via.placeholder.com/50' }}
        style={{ width: 50, height: 50, borderRadius: 25, marginRight: 16 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#000' }}>{`${user.firstName} ${user.lastName}`}</Text>
        <Text style={{ color: '#666', fontSize: 14 }}>{user.isPSW ? 'Current Address' : user.address}</Text>
      </View>
    </View>

    {/* Expanded Header */}
    {isExpanded && (
      <View style={{ marginTop: 16 }}>
        {/* Notes */}
        <Text style={{ fontSize: 14, color: '#666', marginBottom: 10 }}>
          {session.note || 'No additional details provided.'}
        </Text>

        {/* Date and Time Section */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
            backgroundColor: '#f4f4f4',
            borderRadius: 10,
            padding: 12,
          }}
        >
          {/* Date Section */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                backgroundColor: '#e5e5e5',
                borderRadius: 20,
                padding: 8,
                marginRight: 8,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Placeholder for the Calendar Icon */}
              <Text style={{ fontSize: 16, color: '#000' }}>📅</Text>
            </View>
            <Text style={{ fontSize: 14, color: '#000' }}>
              {new Date(session.startTime || '').toLocaleDateString('en-US', {
                weekday: 'short',
                day: '2-digit',
                month: 'short',
              })}
            </Text>
          </View>

          {/* Time Section */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                backgroundColor: '#e5e5e5',
                borderRadius: 20,
                padding: 8,
                marginRight: 8,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Placeholder for the Clock Icon */}
              <Text style={{ fontSize: 16, color: '#000' }}>⏰</Text>
            </View>
            <Text style={{ fontSize: 14, color: '#000' }}>
              {new Date(session.startTime || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
              {new Date(session.endTime || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#000',
              flex: 1,
              padding: 12,
              borderRadius: 8,
              alignItems: 'center',
              marginRight: 8,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Change Time</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderColor: '#000',
              borderWidth: 1,
              flex: 1,
              padding: 12,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#000', fontWeight: 'bold' }}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* Status and Total Cost */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: '#888', fontSize: 14 }}>Awaiting confirmation</Text>
          <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#000' }}>
            Total Cost: ${session.billingDetails?.total.toFixed(2)}
          </Text>
        </View>
      </View>
    )}
  </TouchableOpacity>
)};

const ChatPage = () => {
  const { sessionObj, user } = useLocalSearchParams();
  if (!sessionObj || !user) return null;

  const sessionData: Session = JSON.parse(sessionObj as string);
  const otherUser: User = JSON.parse(user as string);
  const sessionId = sessionData.id;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const currentUserId = FIREBASE_AUTH.currentUser?.uid;

  useEffect(() => {
    if (sessionId) {
      const unsubscribe = fetchMessages(sessionId, setMessages);
      return () => unsubscribe();
    }
  }, [sessionId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && currentUserId && sessionId) {
      await addMessage(sessionId, newMessage.trim(), currentUserId);
      setNewMessage('');
      Keyboard.dismiss(); // Dismiss the keyboard after sending
    }
  };

  const fetchMessages = (sessionId: string, callback: (messages: Message[]) => void) => {
    const messagesRef = collection(FIREBASE_DB, 'sessions', sessionId, 'messages');
    const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const fetchedMessages: Message[] = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Message[];
      callback(fetchedMessages);
    });
    return unsubscribe;
  };

  const addMessage = async (sessionId: string, messageText: string, userId: string) => {
    const messagesRef = collection(FIREBASE_DB, 'sessions', sessionId, 'messages');
    await addDoc(messagesRef, {
      userId,
      message: messageText,
      sessionId,
      timestamp: new Date().toISOString(),
    });
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={{
        padding: 10,
        backgroundColor: item.userId === currentUserId ? '#0D99FF' : '#E5E5EA',
        marginVertical: 5,
        borderRadius: 20,
        alignSelf: item.userId === currentUserId ? 'flex-end' : 'flex-start',
        maxWidth: '75%',
      }}
    >
      <Text style={{ fontWeight: 'bold', color: item.userId === currentUserId ? '#FFF' : '#000' }}>
        {item.userId === currentUserId ? 'You' : otherUser.firstName}
      </Text>
      <Text style={{ color: item.userId === currentUserId ? '#FFF' : '#000' }}>{item.message}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ChatHeader
        session={sessionData}
        user={otherUser}
        isExpanded={isExpanded}
        toggleExpanded={() => setIsExpanded((prev) => !prev)}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ padding: 10 }}
        />
        <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}>
          <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            placeholderTextColor={'#ccc'}
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 10,
              borderRadius: 20,
              backgroundColor: '#f9f9f9',
              marginRight: 8,
            }}
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            style={{
              backgroundColor: '#007AFF',
              padding: 10,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatPage;