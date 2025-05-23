import React, { useState, useEffect } from 'react';
import { SafeAreaView, KeyboardAvoidingView, Keyboard, Platform, StatusBar } from 'react-native';
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
import { clearMessages, fetchMessagesBySessionId } from '@/redux/chatSlice';

const ChatPage = () => {
	const { sessionId } = useLocalSearchParams();
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
	const messages = useSelector((state: RootState) => state.chat.messages); // Get messages from Redux state
	const [newMessage, setNewMessage] = useState('');

	useEffect(() => {

		if (sessionId){
			dispatch(fetchMessagesBySessionId(sessionId as string));
		}

		// Get the socket instance
		const socket = getSocket();
	  
		if (socket) {
		  // Emit 'chat:joinSession' when the component mounts for this sessionId
		  console.log(`Emitting 'chat:joinSession' for session: ${sessionId}`);
		  socket.emit('chat:joinSession', sessionId);
	  		return () => {
				console.log(`Emitting 'chat:leaveSession' for session: ${sessionId}`);
				socket.emit('chat:leaveSession', sessionId);
				dispatch(clearMessages());
		  	};
		}
		return undefined; 
	},[sessionId, dispatch])

	const handleSendMessage = async () => {
		try {
			if (newMessage.trim()) {
				const nextMessage = await sendMessage(sessionId as string, currentUser.id, newMessage.trim());
				console.log('Message sent:', nextMessage);
			setNewMessage('');
			Keyboard.dismiss();
		}} catch (error) {
			console.error('Error sending message:', error);
		}
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
