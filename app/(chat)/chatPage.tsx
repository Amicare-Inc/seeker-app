// src/screens/ChatPage.tsx
import React, { useState, useEffect } from 'react';
import {
    KeyboardAvoidingView,
    Keyboard,
    Platform,
    View,
    StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useSelector } from 'react-redux';
import ChatHeader from '@/components/Chat/ChatHeader';
import ChatMessageList from '@/components/Chat/ChatMessageList';
import ChatInput from '@/components/Chat/ChatInput';
import {
    addDoc,
    collection,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
} from 'firebase/firestore';
import { FIREBASE_DB } from '@/firebase.config';
import { Message } from '@/types/Message';
import { EnrichedSession } from '@/types/EnrichedSession';
import { RootState } from '@/redux/store';
import { LinearGradient } from 'expo-linear-gradient';

const ChatPage = () => {
    const { sessionId } = useLocalSearchParams();
    const currentUser = useSelector((state: RootState) => state.user.userData);
    const activeSession = useSelector(
        (state: RootState) =>
            state.sessions.activeEnrichedSession ||
            state.sessions.allSessions.find((s) => s.id === sessionId),
    ) as EnrichedSession | undefined;
    const [isHeaderExpanded, setIsHeaderExpanded] = useState(true);
    const insets = useSafeAreaInsets();

    if (!sessionId || !activeSession || !currentUser) return null;
    const otherUser = activeSession.otherUser;
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        if (!sessionId) return;
        const messagesRef = collection(
            FIREBASE_DB,
            'sessions_test1',
            sessionId as string,
            'messages',
        );
        const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));
        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const fetchedMessages: Message[] = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    ...data,
                    id: doc.id,
                    timestamp: data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : data.timestamp,
                } as Message;
            });
            setMessages(fetchedMessages);
        });
        return () => unsubscribe();
    }, [sessionId]);

    const toggleHeaderExpanded = () => {
        setIsHeaderExpanded(!isHeaderExpanded);
    };

    const handleInputFocusChange = (isFocused: boolean) => {
        if (isFocused && isHeaderExpanded) {
            setIsHeaderExpanded(false);
        }
    };

    const addMessage = async (
        sessionId: string,
        messageText: string,
        userId: string,
    ) => {
        const messagesRef = collection(
            FIREBASE_DB,
            'sessions_test1',
            sessionId,
            'messages',
        );
        try {
            await addDoc(messagesRef, {
                userId,
                message: messageText,
                sessionId,
                timestamp: serverTimestamp(),
            });
        } catch (error) {
            console.error("Error adding message: ", error);
        }
    };

    const handleSendMessage = async () => {
        if (newMessage.trim() && sessionId && currentUser) {
            await addMessage(
                sessionId as string,
                newMessage.trim(),
                currentUser.id,
            );
            setNewMessage('');
            Keyboard.dismiss();
        }
    };
    
    return (
        <SafeAreaView className="flex-1" edges={['left', 'right', 'bottom']}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <LinearGradient
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                colors={
                    activeSession.status === 'confirmed'
                        ? ['#008DF4', '#5CBAFF']
                        : ['#FFFFFF', '#FFFFFF']
                }
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 0,
                    paddingTop: insets.top,
                }}
            />
            <View style={{ paddingTop: insets.top }}>
                <ChatHeader
                    session={activeSession}
                    user={otherUser!}
                    isExpanded={isHeaderExpanded}
                    toggleExpanded={toggleHeaderExpanded}
                />
            </View>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
                style={{ backgroundColor: '#f0f0f0' }}
            >
                <ChatMessageList
                    messages={messages}
                    otherUserName={otherUser?.firstName || ''}
                    currentUserId={currentUser.id}
                />
                <ChatInput
                    newMessage={newMessage}
                    setNewMessage={setNewMessage}
                    handleSendMessage={handleSendMessage}
                    onFocusChange={handleInputFocusChange}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ChatPage;
