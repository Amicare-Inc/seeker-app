import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Keyboard, Platform, View, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useSelector } from 'react-redux';
import { ChatHeader, ChatMessageList, ChatInput } from '@/features/chat';
import { EnrichedSession } from '@/types/EnrichedSession';
import { RootState } from '@/redux/store';
import { LinearGradient } from 'expo-linear-gradient';
import { useMessages, useSendMessage, useEnrichedSessions } from '@/features/sessions/api/queries';
import { useActiveSession } from '@/lib/context/ActiveSessionContext';
import { getSocket } from '@/src/features/socket';

const ChatPage = () => {
    const { sessionId } = useLocalSearchParams();
    const insets = useSafeAreaInsets();
    const currentUser = useSelector((state: RootState) => state.user.userData);
    const { activeEnrichedSession } = useActiveSession();
    const { data: allSessions = [] } = useEnrichedSessions(currentUser?.id);
    const activeSession = activeEnrichedSession || allSessions.find((s) => s.id === sessionId);
    const [isHeaderExpanded, setIsHeaderExpanded] = useState(true);

    if (!sessionId || !activeSession || !currentUser) return null;

    const otherUser = activeSession.otherUser;
    const { data: messages = [] } = useMessages(sessionId as string);
    const sendMessageMutation = useSendMessage();
    const [newMessage, setNewMessage] = useState('');

    // Join chat room specifically for receiving messages (in addition to session room via useSocketRoom)
    useEffect(() => {
        const socket = getSocket();
        if (socket && sessionId) {
            socket.emit('chat:joinSession', sessionId);
            return () => {
                socket.emit('chat:leaveSession', sessionId);
            };
        }
    }, [sessionId]);

    const toggleHeaderExpanded = () => {
        setIsHeaderExpanded(!isHeaderExpanded);
    };

    const handleInputFocusChange = (isFocused: boolean) => {
        if (isFocused && isHeaderExpanded) {
            setIsHeaderExpanded(false);
        }
    };

    const handleSendMessage = async () => {
        try {
            if (newMessage.trim()) {
                await sendMessageMutation.mutateAsync({
                    sessionId: sessionId as string,
                    userId: currentUser.id!,
                    message: newMessage.trim()
                });
                setNewMessage('');
                Keyboard.dismiss();
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <SafeAreaView className="flex-1" edges={['left', 'right', 'bottom']}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={['#FFFFFF', '#FFFFFF']}
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
                otherUser={otherUser!}
                currentUserId={currentUser.id!}
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