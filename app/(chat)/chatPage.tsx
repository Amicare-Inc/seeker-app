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
import { joinChatSession, leaveChatSession } from '@/src/features/socket';
import { markMessagesRead } from '@/features/sessions/api/sessionApi';
import { useUnreadActions } from '@/features/chat/unread/useUnread';

const ChatPage = () => {
    const { sessionId } = useLocalSearchParams();
    const insets = useSafeAreaInsets();
    const currentUser = useSelector((state: RootState) => state.user.userData);
    const { activeEnrichedSession } = useActiveSession();
    const { data: allSessions = [] } = useEnrichedSessions(currentUser?.id);
    const activeSession = activeEnrichedSession || allSessions.find((s) => s.id === sessionId);
    const [isHeaderExpanded, setIsHeaderExpanded] = useState(true);
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const { markRead } = useUnreadActions();

    // Listen for keyboard events
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setIsKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setIsKeyboardVisible(false);
        });

        return () => {
            keyboardDidShowListener?.remove();
            keyboardDidHideListener?.remove();
        };
    }, []);

    if (!sessionId || !activeSession || !currentUser) return null;

    const otherUser = activeSession.otherUser;
    const { data: messages = [] } = useMessages(sessionId as string);
    const sendMessageMutation = useSendMessage();
    const [newMessage, setNewMessage] = useState('');

    // Join chat room specifically for receiving messages (in addition to session room via useSocketRoom)
    useEffect(() => {
        if (sessionId) {
            joinChatSession(sessionId as string);
            // Mark as read on open (server + local)
            markRead(sessionId as string);
            markMessagesRead(sessionId as string).catch(() => {});
            return () => {
                leaveChatSession(sessionId as string);
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
            
            {/* White background for status bar area */}
            <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: insets.top,
                backgroundColor: '#FFFFFF',
                zIndex: 10,
            }} />
            
            {/* Chat content with header in normal layout flow */}
            <View className="flex-1 bg-grey-0" style={{ paddingTop: insets.top }}>
                {/* Header as part of normal layout */}
                <View style={{ backgroundColor: '#FFFFFF' }}>
                    <ChatHeader
                        session={activeSession}
                        user={otherUser!}
                        isExpanded={isHeaderExpanded}
                        toggleExpanded={toggleHeaderExpanded}
                    />
                </View>
                
                {/* KeyboardAvoidingView wraps the message list and input */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                    keyboardVerticalOffset={Platform.OS === 'android' ? insets.bottom : 0}
                >
                    <ChatMessageList
                        messages={messages}
                        otherUser={otherUser!}
                        currentUserId={currentUser.id!}
                        isKeyboardVisible={isKeyboardVisible}
                    />
                    <ChatInput
                        newMessage={newMessage}
                        setNewMessage={setNewMessage}
                        handleSendMessage={handleSendMessage}
                        onFocusChange={handleInputFocusChange}
                    />
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
};

export default ChatPage;