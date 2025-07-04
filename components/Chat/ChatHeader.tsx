// src/components/Chat/ChatHeader.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
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
		!!currentUser && !!currentUser.id && currentSession.confirmedBy?.includes(currentUser.id);

	// Address display logic
	const cityProvince =
		user.address?.city && user.address?.province
			? `${user.address.city}, ${user.address.province}`
			: user.address?.fullAddress || 'No Address';

	const showFullAddress = isConfirmed || currentSession.status === 'inProgress';
	const addressDisplay = showFullAddress
		? user.address?.fullAddress || cityProvince
		: cityProvince;

	let subTitle = addressDisplay; // Show address regardless of expanded/collapsed

	// NEW: Instead of performing the booking or cancellation directly,
	// navigate to a new page called "session-confirmation" with an action parameter.
	const navigateToSessionConfirmation = (
		action: 'book' | 'cancel' | 'change',
	) => {
		if (!user.id) return;
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
			if (!user.id) return;
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

	const formattedDate = formatDate(currentSession.startTime || '');
	const formattedTimeRange = formatTimeRange(
		currentSession.startTime || '',
		currentSession.endTime || '',
	);

	return (
		<View style={{ backgroundColor: '#fff' }}>
			{/* Top row */}
			<View className="flex-row items-center px-4 mb-[16px]">
				<TouchableOpacity
					onPress={() => router.back()}
					className="mr-3"
				>
					<Feather
						name="chevron-left"
						size={24}
						color="#000"
					/>
				</TouchableOpacity>
				<Image
					source={{
						uri:
							user.profilePhotoUrl ||
							'https://via.placeholder.com/50',
					}}
					className="w-[44px] h-[44px] rounded-full mr-[13px]"
				/>
				<TouchableOpacity onPress={toggleExpanded} className="flex-1">
					<Text
						className="font-semibold text-lg text-black"
					>
						{user.firstName} {user.lastName}
					</Text>
					<Text
						className="text-xs mt-0.5 text-gray-500"
					>
						{subTitle}
					</Text>
				</TouchableOpacity>
				{isExpanded && (
					<TouchableOpacity onPress={handleNavigateToUserProfile}>
						<Ionicons
							name="information-circle-outline"
							size={28}
							color="#303031"
						/>
					</TouchableOpacity>
				)}
			</View>

			{/* Expanded panel */}
			{isExpanded && (
				<View className="px-4 mb-[16px]">
					<Text
						className="text-sm mb-3 font-medium text-[#797979]"
					>
						{currentSession.note ||
							'No additional details provided.'}
					</Text>
					<View
						className="flex-row items-center justify-center rounded-full py-0.5 mb-[16px]"
						style={{
							width: '100%',
							borderWidth: isConfirmed ? 0 : 1,
							borderColor: isConfirmed ? undefined : '#E5E5EA',
							backgroundColor: isConfirmed ? '#DCDCE1' : '#F2F2F7',
						}}
					>
						<View className="flex-1 flex-row items-center justify-center py-3 ">
							<Ionicons
								name="calendar"
								size={20}
								color="#303031"
							/>
							<Text
								className="text-base ml-2 font-medium"
							>
								{formattedDate}
							</Text>
							<Text
								className="text-xs ml-2"
								style={{ color: isConfirmed ? '#75D87F' : '#22c55e' }}
							>{`${isNextDay ? '+1' : ''}`}</Text>
						</View>
						<View
							style={{
								width: 1,
								height: 28,
								backgroundColor: "#fff"
							}}
						/>
						<View className="flex-1 flex-row items-center justify-center">
							<Ionicons
								name="time"
								size={20}
								color="#303031"
							/>
							<Text
								className="text-sm ml-2 font-medium"
							>
								{formattedTimeRange}
							</Text>
						</View>
					</View>

					{currentSession.status !== 'inProgress' && !isConfirmed && (
						<View className="mb-4">
							{!isDisabled && (
								<TouchableOpacity
									onPress={handleBookSession}
									className="px-6 py-3 rounded-lg"
									style={{
										width: '100%',
										backgroundColor: '#008DF4',
									}}
								>
									<Text className="text-lg font-bold text-center text-white">
										Book
									</Text>
								</TouchableOpacity>
							)}
						</View>
					)}

					<View className="flex-row items-center justify-between mb-[16px]">
						<View className="flex-row items-center gap-1">
							<Ionicons
								name="checkmark-circle"
								size={22}
								color={
									currentSession.status === 'inProgress'
										? 'black'
										: isConfirmed
											? '#75D87F'
											: '#0C7AE2'
								}
								style={{ marginLeft: 4 }}
							/>
							<Text
								className="text-sm font-medium text-[#797979]"
							>
								{currentSession.status === 'inProgress'
									? 'Session in Progress'
									: isConfirmed
										? 'Awaiting Confirmation'
										: 'Request Accepted'}
							</Text>
						</View>
						<Text
							className="text-sm font-medium text-[#797979]"
						>
							Total Cost:{' '}
							<Text className="font-semibold">${costLabel}</Text>
						</Text>
					</View>

					{/* Show change time button only if NOT in progress */}
					{currentSession.status !== 'inProgress' &&  (
						<View className="flex-row items-center justify-between">
							<TouchableOpacity
								// onPress={handleNavigateToRequestSession}
								className=""
							>
								<Text
									className="text-sm font-medium text-grey-58 underline"
								>
									Change
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								// onPress={handleNavigateToRequestSession}
								className=""
							>
								<Text
									className="text-sm font-medium text-grey-58 underline"
								>
									Cancel
								</Text>
							</TouchableOpacity>
						</View>
					)}
				</View>
			)}
		</View>
	);
};

export default ChatHeader;
