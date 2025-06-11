// src/components/Chat/ChatHeader.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { Session } from '@/types/Sessions';
import { User } from '@/types/User';
import { setActiveProfile } from '@/redux/activeProfileSlice';
import { formatDate, formatTimeRange } from '@/scripts/datetimeHelpers';
import { LinearGradient } from 'expo-linear-gradient';
import { getSocket } from '@/services/node-express-backend/sockets';
import { EnrichedSession } from '@/types/EnrichedSession';

interface ChatHeaderProps {
	session: EnrichedSession;
	user: User;
	isExpanded: boolean;
	toggleExpanded: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
	session,
	user,
	isExpanded,
	toggleExpanded,
}) => {
	const dispatch = useDispatch<AppDispatch>();
	const currentUser = useSelector((state: RootState) => state.user.userData);
	const currentSession = useSelector((state: RootState) => 
		state.sessions.allSessions.find(s => s.id === session.id)
	) || session; // Fallback to prop if not in Redux

	useEffect(() => {
		if (!session.id) return;
		
		const socket = getSocket();
		if (!socket) {
			console.error('Socket not connected');
			return;
		}

		// Join the session room
		socket.emit('session:join', session.id);

		// Cleanup
		return () => {
			socket.emit('session:leave', session.id);
		};
	}, [session.id]);

	const isConfirmed = currentSession.status === 'confirmed';
	const isPending = currentSession.status === 'pending';
	const isUserConfirmed =
		!!currentUser && currentSession.confirmedBy?.includes(currentUser.id);

	const formattedDate = formatDate(currentSession.startTime || '');
	const formattedTimeRange = formatTimeRange(
		currentSession.startTime || '',
		currentSession.endTime || '',
	);

	let subTitle = '';
	if (isExpanded) {
		subTitle =
			currentUser?.isPsw && !user.address
				? 'Current Address'
				: user.address || 'No Address';
	} else {
		subTitle = `${formattedDate} • ${formattedTimeRange}`;
	}

	// NEW: Instead of performing the booking or cancellation directly,
	// navigate to a new page called "session-confirmation" with an action parameter.
	const navigateToSessionConfirmation = (
		action: 'book' | 'cancel' | 'change',
	) => {
		router.push({
			pathname: '/session-confirmation',
			params: {
				sessionId: currentSession.id,
				action, // "book", "cancel", or "change"
				otherUserId: user.id, // so the confirmation page can show "… once [name] also books"
			},
		});
	};

	const handleBookSession = async () => {
		if (!currentUser) return;
		// For a pending session, when the user taps "Book" we navigate
		// to the session-confirmation page with action "book".
		navigateToSessionConfirmation('book');
	};

	const handleCancelSession = async () => {
		// For a pending or confirmed session, navigate to session-confirmation with action "cancel".
		navigateToSessionConfirmation('cancel');
	};

	const handleChangeSession = async () => {
		// For a pending or confirmed session, navigate to session-confirmation with action "cancel".
		navigateToSessionConfirmation('change');
	};

	const handleNavigateToRequestSession = () => {
		if (session.status === 'confirmed') {
			console.log('SESSION CONFIRMED');
			handleChangeSession();
		} else {
			dispatch(setActiveProfile(user));
			router.push({
				pathname: '/request-sessions',
				params: {
					otherUserId: user.id,
					sessionObj: JSON.stringify(currentSession),
				},
			});
		}
	};

	const handleNavigateToUserProfile = () => {
		dispatch(setActiveProfile(user));
		router.push('/other-user-profile');
	};

	const isDisabled = !isConfirmed && isUserConfirmed;
	const bookText = isConfirmed
		? 'Change'
		: isUserConfirmed
			? 'Waiting...'
			: 'Book';

	const totalCost = currentSession.billingDetails?.total ?? 0;
	const costLabel = `${totalCost.toFixed(2)}`;
	const startDateObj = session.startTime ? new Date(session.startTime) : null;
	const endDateObj = session.endTime ? new Date(session.endTime) : null;
	const isNextDay =
		startDateObj && endDateObj
			? endDateObj.getDate() !== startDateObj.getDate()
			: false;

	return (
		<LinearGradient
			start={{ x: 0, y: 0.5 }}
			end={{ x: 1, y: 0.5 }}
			colors={
				currentSession.status === 'inProgress' 
					? ['#05a73c', '#4ade80']  // Matching the parent gradient
					: isConfirmed 
						? ['#008DF4', '#5CBAFF']  // Blue gradient for confirmed
						: ['#ffffff', '#ffffff']   // White for other states
			}
		>
			{/* Top row */}
			<View className="flex-row items-center px-4 pb-3">
				<TouchableOpacity
					onPress={() => router.back()}
					className="mr-3"
				>
					<Feather
						name="chevron-left"
						size={24}
						color={currentSession.status === 'inProgress' ? 'black' : (isConfirmed ? '#fff' : '#000')}
					/>
				</TouchableOpacity>
				<Image
					source={{
						uri:
							user.profilePhotoUrl ||
							'https://via.placeholder.com/50',
					}}
					className="w-14 h-14 rounded-full mr-3"
				/>
				<TouchableOpacity onPress={toggleExpanded} className="flex-1">
					<Text
						className={`font-semibold text-lg ${currentSession.status === 'inProgress' ? 'text-black' : (isConfirmed ? 'text-white' : 'text-black')}`}
					>
						{user.firstName} {user.lastName}
					</Text>
					<Text
						className={`text-xs mt-0.5 ${currentSession.status === 'inProgress' ? 'text-black' : (isConfirmed ? 'text-white' : 'text-gray-500')}`}
					>
						{subTitle}
					</Text>
				</TouchableOpacity>
				{isExpanded && (
					<TouchableOpacity onPress={handleNavigateToUserProfile}>
						<Feather
							name="info"
							size={24}
							color={currentSession.status === 'inProgress' ? 'black' : (isConfirmed ? '#fff' : '#000')}
						/>
					</TouchableOpacity>
				)}
			</View>

			{/* Expanded panel */}
			{isExpanded && (
				<View className="px-4 pb-4">
					<Text
						className={`text-sm mb-3 ${currentSession.status === 'inProgress' ? 'text-black' : (isConfirmed ? 'text-white' : 'text-gray-400')}`}
					>
						{currentSession.note ||
							'No additional details provided.'}
					</Text>
					<View
						className={`flex-row items-center justify-center rounded-full py-0.5 mb-4 ${currentSession.status === 'inProgress' ? 'border border-black' : (isConfirmed ? 'border border-white' : '')}`}
						style={{
							width: '100%',
							backgroundColor: 'transparent'
						}}
					>
						<View className="flex-1 flex-row items-center justify-center py-3">
							<Feather
								name="calendar"
								size={22}
								color={currentSession.status === 'inProgress' ? 'black' : (isConfirmed ? '#fff' : '#000')}
							/>
							<Text
								className={`text-sm ml-2 font-medium ${currentSession.status === 'inProgress' ? 'text-black' : (isConfirmed ? 'text-white' : 'text-black')}`}
							>
								{formattedDate}
							</Text>
							<Text className={`text-xs ml-2 ${currentSession.status === 'inProgress' ? 'text-black' : (isConfirmed ? 'text-white' : 'text-green-400')}`}>{`${isNextDay ? '+1' : ''}`}</Text>
						</View>
						<View
							style={{ width: 1, height: 28 }}
							className={currentSession.status === 'inProgress' ? 'bg-black' : (isConfirmed ? 'bg-white' : 'bg-neutral-100')}
						/>
						<View className="flex-1 flex-row items-center justify-center">
							<Feather
								name="clock"
								size={22}
								color={currentSession.status === 'inProgress' ? 'black' : (isConfirmed ? '#fff' : '#000')}
							/>
							<Text
								className={`text-xs ml-2 font-medium ${currentSession.status === 'inProgress' ? 'text-black' : (isConfirmed ? 'text-white' : 'text-black')}`}
							>
								{formattedTimeRange}
							</Text>
						</View>
					</View>

					{/* Show buttons section only if NOT in progress */}
					{currentSession.status !== 'inProgress' ? (
					<View className="flex-row items-center justify-between mb-4">
						<TouchableOpacity
							onPress={
								isConfirmed
									? handleNavigateToRequestSession
									: handleBookSession
							}
							disabled={isDisabled}
							activeOpacity={0.8}
							className="px-6 py-3 rounded-lg"
							style={{
								width: '48%',
								backgroundColor: isConfirmed
									? '#fff'
									: isDisabled
										? '#d1d5db'
										: '#008DF4',
							}}
						>
							<Text
								className={`text-sm text-center ${isDisabled ? 'text-black' : isConfirmed ? 'text-black' : 'text-white'}`}
							>
								{bookText}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={handleCancelSession}
							activeOpacity={0.8}
							className="bg-black px-6 py-3 rounded-lg"
							style={{ width: '48%' }}
						>
							<Text className="text-white text-sm text-center">
								Cancel
							</Text>
						</TouchableOpacity>
					</View>
					) : (
						/* Show cancel button for inProgress */
						<View className="flex-row items-center justify-center mb-4">
							<TouchableOpacity
								onPress={handleCancelSession}
								activeOpacity={0.8}
								className="bg-black px-6 py-3 rounded-lg"
								style={{ width: '100%' }}
							>
								<Text className="text-white text-sm text-center">
									Cancel
								</Text>
							</TouchableOpacity>
						</View>
					)}

					<View className="flex-row items-center justify-between mb-3">
						<View className="flex-row items-center gap-1">
							<Feather
								name={
									currentSession.status === 'inProgress'
										? 'play-circle'
										: isConfirmed
											? 'check-circle'
										: 'alert-circle'
								}
								size={22}
								color={currentSession.status === 'inProgress' ? 'black' : (isConfirmed ? '#fff' : '#9ca3af')}
								style={{ marginLeft: 4 }}
							/>
							<Text
								className={`text-sm ${currentSession.status === 'inProgress' ? 'text-black' : (isConfirmed ? 'text-white' : 'text-neutral-500')}`}
							>
								{currentSession.status === 'inProgress'
									? 'Session in Progress'
									: isConfirmed
									? 'Appointment Confirmed'
									: 'Awaiting confirmation'}
							</Text>
						</View>
						<Text
							className={`text-sm ${currentSession.status === 'inProgress' ? 'text-black' : (isConfirmed ? 'text-white' : 'text-neutral-500')}`}
						>
							Total Cost:{' '}
							<Text className="font-bold">${costLabel}</Text>
						</Text>
					</View>

					{/* Show change time button only if NOT in progress */}
					{currentSession.status !== 'inProgress' && !isConfirmed && (
						<TouchableOpacity
							onPress={handleNavigateToRequestSession}
							activeOpacity={0.8}
							className={`border px-5 py-2 items-center rounded-lg ${isConfirmed ? 'border-white' : 'border-black'}`}
						>
							<Text
								className={`text-sm ${isConfirmed ? 'text-white' : 'text-black'}`}
							>
								Request Date/Time Change
							</Text>
						</TouchableOpacity>
					)}
				</View>
			)}
		</LinearGradient>
	);
};

export default ChatHeader;
