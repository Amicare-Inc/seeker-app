// src/screens/ChatPage.tsx
import React, { useState, useEffect } from 'react';
import {SafeAreaView, KeyboardAvoidingView, Keyboard, Platform, View} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSelector } from 'react-redux';
import ChatHeader from '@/components/Chat/ChatHeader';
import ChatMessageList from '@/components/Chat/ChatMessageList';
import ChatInput from '@/components/Chat/ChatInput';
import { addDoc, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { FIREBASE_DB } from '@/firebase.config';
import { Message } from '@/types/Message';
import { EnrichedSession } from '@/types/EnrichedSession';
import { RootState } from '@/redux/store';

const ChatPage = () => {
  // Retrieve the session ID from route parameters.
  const { sessionId } = useLocalSearchParams();
  // Get current user from Redux.
  const currentUser = useSelector((state: RootState) => state.user.userData);
  // Retrieve the active enriched session from Redux (or look it up by ID).
  const activeSession = useSelector((state: RootState) =>
    state.sessions.activeEnrichedSession ||
    state.sessions.allSessions.find((s) => s.id === sessionId)
  ) as EnrichedSession | undefined;
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(true);

  // Debug logs
  console.log('ChatPage - sessionId:', sessionId);
  console.log('ChatPage - currentUser:', currentUser);
  console.log('ChatPage - activeSession:', activeSession);

  // If essential data is missing, return null.
  if (!sessionId || !activeSession || !currentUser) return null;

  // Destructure otherUser from the enriched session.
  const otherUser = activeSession.otherUser;

  // Local state for messages.
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const unsubscribe = fetchMessages(sessionId as string, setMessages);
    return () => unsubscribe();
  }, [sessionId]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      await addMessage(sessionId as string, newMessage.trim(), currentUser.id);
      setNewMessage('');
      Keyboard.dismiss();
    }
  };

  // Firestore message fetching function.
  const fetchMessages = (sessionId: string, callback: (msgs: Message[]) => void) => {
    const messagesRef = collection(FIREBASE_DB, 'sessions_test1', sessionId, 'messages');
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

  // Firestore message sending function.
  const addMessage = async (sessionId: string, messageText: string, userId: string) => {
    const messagesRef = collection(FIREBASE_DB, 'sessions_test1', sessionId, 'messages');
    await addDoc(messagesRef, {
      userId,
      message: messageText,
      sessionId,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#f0f0f0' }}>
      <ChatHeader
        session={activeSession}
        user={otherUser!}
        isExpanded={isHeaderExpanded}
        toggleExpanded={() => setIsHeaderExpanded((prev) => !prev)}
      />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1" style={{ backgroundColor: '#f0f0f0' }}>
          <ChatMessageList messages={messages} otherUserName={otherUser?.firstName || ''} currentUserId={currentUser.id} />
          <ChatInput newMessage={newMessage} setNewMessage={setNewMessage} handleSendMessage={handleSendMessage} />
        </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatPage;