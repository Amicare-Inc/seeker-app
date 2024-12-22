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
  Button,
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
}> = ({ session, user, isExpanded, toggleExpanded }) => (
  <TouchableOpacity
    onPress={toggleExpanded}
    style={{
      backgroundColor: '#f9f9f9',
      padding: 16,
      borderBottomWidth: isExpanded ? 1 : 0,
      borderBottomColor: '#ccc',
    }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Image
        source={{ uri: user.profilePhotoUrl || 'https://via.placeholder.com/50' }}
        style={{ width: 50, height: 50, borderRadius: 25, marginRight: 16 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#000' }}>{`${user.firstName} ${user.lastName}`}</Text>
        <Text style={{ color: '#666', fontSize: 14 }}>{session.note}</Text>
        <Text style={{ color: '#666', fontSize: 14 }}>
          {new Date(session.startDate || '').toLocaleDateString()} |{' '}
          {new Date(session.startDate || '').toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}{' '}
          -{' '}
          {new Date(session.endDate || '').toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
      <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#000' }}>${session.billingDetails?.total}</Text>
    </View>
    {isExpanded && (
      <View style={{ marginTop: 16 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#000' }}>Location:</Text>
        <Text style={{ fontSize: 14, color: '#666' }}>{'Casa Loma, Toronto'}</Text>
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: '#000',
              padding: 10,
              borderRadius: 8,
              marginRight: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff' }}>Change Time</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              borderColor: '#000',
              borderWidth: 1,
              padding: 10,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#000' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ color: '#888', fontSize: 14, marginTop: 8 }}>Awaiting confirmation</Text>
      </View>
    )}
  </TouchableOpacity>
);

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