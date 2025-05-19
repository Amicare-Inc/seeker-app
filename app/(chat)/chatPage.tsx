// src/screens/ChatPage.tsx
import React, { useState, useEffect } from 'react';
import { SafeAreaView, KeyboardAvoidingView, Keyboard, Platform, StatusBar } from 'react-native';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

	// Debug logs
	// console.log('ChatPage - sessionId:', sessionId);
	// console.log('ChatPage - currentUser:', currentUser);
	// console.log('ChatPage - activeSession:', activeSession);

	if (!sessionId || !activeSession || !currentUser) return null;
	const otherUser = activeSession.otherUser;
	const [messages, setMessages] = useState<Message[]>([]);
	const [newMessage, setNewMessage] = useState('');

	useEffect(() => {
		const unsubscribe = fetchMessages(sessionId as string, setMessages);
		return () => unsubscribe();
	}, [sessionId]);

	const handleSendMessage = async () => {
		if (newMessage.trim()) {
			await addMessage(
				sessionId as string,
				newMessage.trim(),
				currentUser.id,
			);
			setNewMessage('');
			Keyboard.dismiss();
		}
	};

	const fetchMessages = (
		sessionId: string,
		callback: (msgs: Message[]) => void,
	) => {
		const messagesRef = collection(
			FIREBASE_DB,
			'sessions_test1',
			sessionId,
			'messages',
		);
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
		await addDoc(messagesRef, {
			userId,
			message: messageText,
			sessionId,
			timestamp: new Date().toISOString(),
		});
	};

	return (
		<SafeAreaView className="flex-1" style={{ paddingTop: -1 }}>
			<StatusBar translucent backgroundColor="transparent" />
			<LinearGradient
				start={{ x: 0, y: 0.5 }}
				end={{ x: 1, y: 0.5 }}
				colors={
					activeSession.status === 'confirmed'
						? ['#008DF4', '#5CBAFF']
						: ['#ffffff', '#ffffff']
				}
				className=""
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					height:
						Platform.OS === 'android'
							? (StatusBar.currentHeight || 0) + 100
							: 100, // Adjust height as needed
					zIndex: 0,
				}}
			/>
			<ChatHeader
				session={activeSession}
				user={otherUser!}
				isExpanded={isHeaderExpanded}
				toggleExpanded={() => setIsHeaderExpanded((prev) => !prev)}
			/>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
				/>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default ChatPage;
