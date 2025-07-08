import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Keyboard, Platform, View, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import ChatHeader from '@/components/Chat/ChatHeader';
import ChatMessageList from '@/components/Chat/ChatMessageList';
import ChatInput from '@/components/Chat/ChatInput';
import { EnrichedSession } from '@/types/EnrichedSession';
import { AppDispatch, RootState } from '@/redux/store';
import { LinearGradient } from 'expo-linear-gradient';
import { sendMessage } from '@/services/node-express-backend/session';
import { getSocket } from '@/services/node-express-backend/sockets';
import { useMessages } from '@/hooks/useMessages';
import { useQueryClient } from '@tanstack/react-query';

const ChatPage = () => {
    const { sessionId } = useLocalSearchParams();
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch<AppDispatch>();
    const currentUser = useSelector((state: RootState) => state.user.userData);
    const activeSession = useSelector(
        (state: RootState) =>
            state.sessions.activeEnrichedSession ||
            state.sessions.allSessions.find((s) => s.id === sessionId),
    ) as EnrichedSession | undefined;
    const [isHeaderExpanded, setIsHeaderExpanded] = useState(true);

    if (!sessionId || !activeSession || !currentUser) return null;

    const otherUser = activeSession.otherUser;
    const { data: messages = [] } = useMessages(sessionId as string);
    const queryClient = useQueryClient();
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        // Get the socket instance
        const socket = getSocket();

        if (socket) {
            // Emit 'chat:joinSession' when the component mounts for this sessionId
            console.log(`Emitting 'chat:joinSession' for session: ${sessionId}`);
            socket.emit('chat:joinSession', sessionId);
            return () => {
                console.log(`Emitting 'chat:leaveSession' for session: ${sessionId}`);
                socket.emit('chat:leaveSession', sessionId);
            };
        }
        return undefined;
    }, [sessionId, dispatch]);

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
                await sendMessage(sessionId as string, currentUser.id!, newMessage.trim());
                // Refresh messages list
                queryClient.invalidateQueries({ queryKey: ['messages', sessionId] });
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