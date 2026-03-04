import React, { useState, useEffect } from 'react';
import {
    KeyboardAvoidingView,
    Keyboard,
    Platform,
    View,
    StatusBar,
    ActivityIndicator,
    Text,
    TouchableOpacity,
    FlatList,
    TextInput,
    Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useSelector } from 'react-redux';
import { ChatMessageList, ChatInput } from '@/features/chat';
import { RootState } from '@/redux/store';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getAdminChatId,
    createAdminChat,
    getAdminMessages,
    sendAdminMessage,
    getUserChatsForInstitution,
    createUserChatWithTitle,
    type InstitutionChat,
} from '@/features/auth/api/adminChatApi';
import { router } from 'expo-router';
import { User } from '@/types/User';
import { Message } from '@/types/Message';
import { joinAdminChat, leaveAdminChat, getSocket } from '@/src/features/socket';

function formatChatDate(chat: InstitutionChat): string {
    const raw = (chat as any).createdAt;
    if (!raw) return '';
    try {
        const date = typeof raw === 'string' ? new Date(raw) : raw?.toDate?.() ?? new Date(raw);
        return isNaN(date.getTime()) ? '' : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
        return '';
    }
}

const AdminChatPage = () => {
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams<{ institutionId?: string; institutionName?: string; chatId?: string }>();
    const institutionId = params.institutionId ?? undefined;
    const institutionName = (params.institutionName as string) ?? undefined;
    const paramChatId = params.chatId ?? undefined;

    const currentUser = useSelector((state: RootState) => state.user.userData);
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [selectedChatId, setSelectedChatId] = useState<string | null>(() =>
        paramChatId && paramChatId.trim() !== '' ? paramChatId : null
    );
    const [newChatTitle, setNewChatTitle] = useState('New chat');
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const queryClient = useQueryClient();

    const { data: institutionChats = [], isLoading: isLoadingChatList } = useQuery({
        queryKey: ['userInstitutionChats', institutionId],
        queryFn: () => getUserChatsForInstitution(institutionId!),
        enabled: !!institutionId && !!currentUser?.id,
        staleTime: 1000 * 60 * 2,
    });

    const { data: legacyChatData, isLoading: isLoadingLegacyChat } = useQuery({
        queryKey: ['adminChatId'],
        queryFn: async () => {
            const existing = await getAdminChatId();
            if (existing) return existing;
            const newId = await createAdminChat();
            return { id: newId, institutionName: null };
        },
        enabled: !!currentUser?.id && !institutionId,
    });

    const effectiveChatId = institutionId
        ? selectedChatId
        : legacyChatData?.id ?? null;
    const effectiveInstitutionName = institutionId
        ? institutionName ?? 'Support'
        : legacyChatData?.institutionName ?? null;

    const { data: messages = [], isLoading: isLoadingMessages } = useQuery({
        queryKey: ['adminMessages', effectiveChatId],
        queryFn: () => getAdminMessages(effectiveChatId!),
        enabled: !!effectiveChatId,
    });

    useEffect(() => {
        if (!effectiveChatId) return;
        const socket = getSocket();
        if (!socket) return;
        joinAdminChat(effectiveChatId);
        const handleNewMessage = (payload: { chatId: string; message: Message }) => {
            if (!payload?.message) return;
            queryClient.setQueryData(['adminMessages', effectiveChatId], (old: Message[] = []) => {
                if (old.some((m) => m.id === payload.message.id)) return old;
                return [...old, payload.message];
            });
        };
        socket.on('admin-chat:newMessage', handleNewMessage);
        return () => {
            socket.off('admin-chat:newMessage', handleNewMessage);
            leaveAdminChat(effectiveChatId);
        };
    }, [effectiveChatId, queryClient]);

    const sendMessageMutation = useMutation({
        mutationFn: ({ chatId, message }: { chatId: string; message: string }) =>
            sendAdminMessage(chatId, message),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminMessages', effectiveChatId] });
        },
    });

    const createChatMutation = useMutation({
        mutationFn: (title: string) => createUserChatWithTitle(institutionId!, title),
        onSuccess: (newChat) => {
            queryClient.invalidateQueries({ queryKey: ['userInstitutionChats', institutionId] });
            queryClient.invalidateQueries({ queryKey: ['userInstitutions'] });
            setSelectedChatId(newChat.id);
            setShowNewChatModal(false);
            setNewChatTitle('New chat');
        },
    });

    useEffect(() => {
        const show = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardVisible(true));
        const hide = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardVisible(false));
        return () => {
            show?.remove();
            hide?.remove();
        };
    }, []);

    if (!currentUser) {
        router.back();
        return null;
    }

    const isLoading = institutionId ? isLoadingChatList : isLoadingLegacyChat;
    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-grey-0" edges={['left', 'right', 'bottom']}>
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#1A8BF8" />
                    <Text className="mt-4 text-grey-60">Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!institutionId && !legacyChatData?.id) {
        return (
            <SafeAreaView className="flex-1 bg-grey-0" edges={['left', 'right', 'bottom']}>
                <View className="flex-1 justify-center items-center">
                    <Text className="text-grey-60">Failed to load chat</Text>
                </View>
            </SafeAreaView>
        );
    }

    const showChatList = institutionId && !selectedChatId;
    const showConversation = !!effectiveChatId;

    const adminUser: User = {
        id: 'admin',
        firstName: effectiveInstitutionName || 'Amicare',
        lastName: effectiveInstitutionName ? '' : 'Support',
        profilePhotoUrl: undefined,
        dob: '01/01/2000',
        address: {
            fullAddress: 'Amicare HQ',
            street: 'Main St',
            city: 'Toronto',
            province: 'ON',
            country: 'Canada',
            postalCode: 'M1M 1M1',
        },
        phone: '123-456-7890',
        email: 'support@amicare.com',
        isPsw: false,
        onboardingComplete: true,
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !effectiveChatId) return;
        try {
            await sendMessageMutation.mutateAsync({
                chatId: effectiveChatId,
                message: newMessage.trim(),
            });
            setNewMessage('');
            Keyboard.dismiss();
        } catch (e) {
            console.error('Error sending message:', e);
        }
    };

    const handleOpenNewChat = () => {
        setShowNewChatModal(true);
    };

    const handleCreateNewChat = () => {
        const title = newChatTitle.trim() || 'New chat';
        createChatMutation.mutate(title);
    };

    return (
        <SafeAreaView className="flex-1" edges={['left', 'right', 'bottom']}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: insets.top,
                    backgroundColor: '#FFFFFF',
                    zIndex: 10,
                }}
            />
            <View className="flex-1 bg-grey-0" style={{ paddingTop: insets.top }}>
                <View
                    className="flex-row items-center"
                    style={{
                        backgroundColor: '#FFFFFF',
                        padding: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: '#E5E5E5',
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            if (showConversation && institutionId) {
                                setSelectedChatId(null);
                            } else {
                                router.back();
                            }
                        }}
                        className="mr-4"
                    >
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className="text-xl font-semibold text-black">
                            {effectiveInstitutionName || 'Amicare Support'}
                        </Text>
                        <Text className="text-sm text-grey-60 mt-1">
                            {showChatList ? 'Choose a chat or start a new one' : "We're here to help"}
                        </Text>
                    </View>
                </View>

                {showChatList && (
                    <View className="flex-1 px-4 pt-4">
                        <TouchableOpacity
                            onPress={handleOpenNewChat}
                            className="flex-row items-center py-3 px-4 rounded-xl mb-4"
                            style={{ backgroundColor: '#1A8BF8' }}
                        >
                            <Ionicons name="add-circle-outline" size={24} color="#FFF" />
                            <Text className="text-white font-semibold ml-3">New chat</Text>
                        </TouchableOpacity>
                        <FlatList
                            data={institutionChats}
                            keyExtractor={(item) => item.id}
                            ListEmptyComponent={
                                <Text className="text-grey-60 py-8 text-center">
                                    No chats yet. Start one above.
                                </Text>
                            }
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => setSelectedChatId(item.id)}
                                    className="py-4 px-2 border-b border-grey-20 flex-row items-center justify-between"
                                >
                                    <Text className="text-base text-black" numberOfLines={1}>
                                        {item.title || 'Chat'}
                                    </Text>
                                    <Text className="text-sm text-grey-60">
                                        {formatChatDate(item)}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                )}

                {showConversation && (
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
                )}
            </View>

            <Modal
                visible={showNewChatModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowNewChatModal(false)}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setShowNewChatModal(false)}
                    className="flex-1 bg-black/50 justify-center items-center px-6"
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl w-full max-w-sm p-5"
                    >
                        <Text className="text-lg font-semibold text-black mb-2">New chat</Text>
                        <Text className="text-sm text-grey-60 mb-3">Give this chat a title (optional)</Text>
                        <TextInput
                            value={newChatTitle}
                            onChangeText={setNewChatTitle}
                            placeholder="e.g. Billing question"
                            className="border border-grey-30 rounded-xl px-4 py-3 text-base mb-4"
                            placeholderTextColor="#9CA3AF"
                        />
                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                onPress={() => setShowNewChatModal(false)}
                                className="flex-1 py-3 rounded-xl border border-grey-30 items-center"
                            >
                                <Text className="text-black font-medium">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleCreateNewChat}
                                disabled={createChatMutation.isPending}
                                className="flex-1 py-3 rounded-xl items-center"
                                style={{ backgroundColor: '#1A8BF8' }}
                            >
                                {createChatMutation.isPending ? (
                                    <ActivityIndicator size="small" color="#FFF" />
                                ) : (
                                    <Text className="text-white font-medium">Create</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
};

export default AdminChatPage;
