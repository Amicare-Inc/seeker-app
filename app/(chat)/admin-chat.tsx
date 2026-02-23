import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Keyboard, Platform, View, StatusBar, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { ChatMessageList, ChatInput } from '@/features/chat';
import { RootState } from '@/redux/store';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminChatId, createAdminChat, getAdminMessages, sendAdminMessage } from '@/features/auth/api/adminChatApi';
import { router } from 'expo-router';
import { Message } from '@/types/Message';
import { User } from '@/types/User';
import { joinAdminChat, leaveAdminChat, getSocket } from '@/src/features/socket';

const AdminChatPage = () => {
    const insets = useSafeAreaInsets();
    const currentUser = useSelector((state: RootState) => state.user.userData);
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const queryClient = useQueryClient();

    // Get or create chat
    const { data: chatData, isLoading: isLoadingChatId } = useQuery({
        queryKey: ['adminChatId'],
        queryFn: async () => {
            const existing = await getAdminChatId();
            if (existing) {
                return existing; // { id, institutionName }
            }
            // Create new chat (returns just the id string)
            const newId = await createAdminChat();
            return { id: newId, institutionName: null };
        },
        enabled: !!currentUser?.id,
    });

    const chatId = chatData?.id;
    const institutionName = chatData?.institutionName;

    // Get messages
    const { data: messages = [], isLoading: isLoadingMessages } = useQuery({
        queryKey: ['adminMessages', chatId],
        queryFn: () => getAdminMessages(chatId!),
        enabled: !!chatId,
    });

    // WebSocket for real-time messages
    useEffect(() => {
        if (!chatId) return;

        const socket = getSocket();
        if (!socket) return;

        // Join admin chat room
        joinAdminChat(chatId);

        // Listen for new messages
        const handleNewMessage = (payload: { chatId: string; message: Message }) => {
            if (!payload || !payload.message) {
                console.warn('Received invalid message payload:', payload);
                return;
            }
             queryClient.setQueryData(['adminMessages', chatId], (oldMessages: Message[] = []) => {
                 // Check if message already exists to avoid duplicates (though ChatMessageList also dedupes)
                 if (oldMessages.some(m => m.id === payload.message.id)) {
                     return oldMessages;
                 }
                 return [...oldMessages, payload.message];
             });
        };

        socket.on('admin-chat:newMessage', handleNewMessage);

        return () => {
            socket.off('admin-chat:newMessage', handleNewMessage);
            leaveAdminChat(chatId);
        };
    }, [chatId, queryClient]);

    // Send message mutation
    const sendMessageMutation = useMutation({
        mutationFn: ({ chatId, message }: { chatId: string; message: string }) =>
            sendAdminMessage(chatId, message),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminMessages', chatId] });
        },
    });

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

    if (!currentUser) {
        router.back();
        return null;
    }

    if (isLoadingChatId) {
        return (
            <SafeAreaView className="flex-1 bg-grey-0" edges={['left', 'right', 'bottom']}>
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#1A8BF8" />
                    <Text className="mt-4 text-grey-60">Loading chat...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!chatId) {
        return (
            <SafeAreaView className="flex-1 bg-grey-0" edges={['left', 'right', 'bottom']}>
                <View className="flex-1 justify-center items-center">
                    <Text className="text-grey-60">Failed to load chat</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Create admin user object for display
    const adminUser: User = {
        id: 'admin',
        firstName: institutionName || 'Amicare',
        lastName: institutionName ? '' : 'Support',
        profilePhotoUrl: undefined,
        dob: '01/01/2000',
        address: {
            fullAddress: 'Amicare HQ',
            street: 'Main St',
            city: 'Toronto',
            province: 'ON',
            country: 'Canada',
            postalCode: 'M1M 1M1'
        },
        phone: '123-456-7890',
        email: 'support@amicare.com',
        isPsw: false,
        onboardingComplete: true
    };

    const handleSendMessage = async () => {
        try {
            if (newMessage.trim() && chatId) {
                await sendMessageMutation.mutateAsync({
                    chatId,
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
            
            {/* Chat content */}
            <View className="flex-1 bg-grey-0" style={{ paddingTop: insets.top }}>
                {/* Simple header */}
                <View className="flex-row items-center" style={{ backgroundColor: '#FFFFFF', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E5E5' }}>
                    <TouchableOpacity onPress={() => router.back()} className="mr-4">
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <View>
                        <Text className="text-xl font-semibold text-black">Amicare Support</Text>
                        <Text className="text-sm text-grey-60 mt-1">We're here to help</Text>
                    </View>
                </View>
                
                {/* KeyboardAvoidingView wraps the message list and input */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                    keyboardVerticalOffset={Platform.OS === 'android' ? insets.bottom : 0}
                >
                    {isLoadingMessages ? (
                        <View className="flex-1 justify-center items-center">
                            <ActivityIndicator size="large" color="#1A8BF8" />
                        </View>
                    ) : (
                        <ChatMessageList
                            messages={messages as Message[]}
                            otherUser={adminUser}
                            currentUserId={currentUser.id!}
                            isKeyboardVisible={isKeyboardVisible}
                        />
                    )}
                    <ChatInput
                        newMessage={newMessage}
                        setNewMessage={setNewMessage}
                        handleSendMessage={handleSendMessage}
                        onFocusChange={() => {}}
                    />
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
};

export default AdminChatPage;
