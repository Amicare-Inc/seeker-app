import React from 'react';
import { SafeAreaView, View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { bookSessionThunk, cancelSessionThunk, declineSessionThunk } from '@/redux/sessionSlice';
import { PaymentService } from '@/services/stripe/payment-service';
import { EnrichedSession } from '@/types/EnrichedSession';

const SessionConfirmation = () => {
	const { sessionId, action } = useLocalSearchParams();
	const dispatch = useDispatch<AppDispatch>();
	const currentUser = useSelector((state: RootState) => state.user.userData);
	const activeSession = useSelector(
		(state: RootState) =>
			state.sessions.activeEnrichedSession ||
			state.sessions.allSessions.find((s) => s.id === sessionId),
	) as EnrichedSession | undefined;
	const paymentService = PaymentService.getInstance();

	if (!activeSession || !currentUser || !activeSession.otherUser) {
		return (
			<SafeAreaView className="flex-1 justify-center items-center bg-white">
				<Text>Loading...</Text>
			</SafeAreaView>
		);
	}

	const otherUser = activeSession.otherUser;
	const timeDiff = activeSession.startTime
		? (new Date(activeSession.startTime).getTime() - new Date().getTime()) /
			(1000 * 60 * 60)
		: null;

	let headerText = '';
	let messageText = '';
	let primaryButtonText = '';
	let primaryButtonColor = '';
	let onPrimaryPress: () => void = () => {};
	const onBackPress = () => router.back();

	if (action === 'book') {
		headerText = 'Confirm Booking';
		messageText = `By clicking "Book Session" you agree to the terms and conditions. The session will be confirmed once ${otherUser.firstName} also books.`;
		primaryButtonText = 'Book Session';
		primaryButtonColor = '#008DF4';
		onPrimaryPress = async () => {
			try {
				if (!currentUser.isPsw) {
					// Only process payment for non-PSW users
					const paymentSuccess = await paymentService.initiatePayment(activeSession);
					if (!paymentSuccess) {
						return; // Exit if payment failed
					}
				}

				// Book the session
				await dispatch(bookSessionThunk({
					sessionId: activeSession.id,
					currentUserId: currentUser.id
				})).unwrap();

				Alert.alert(
					'Success',
					'Session booked successfully!',
					[{ 
						text: 'OK',
						onPress: () => router.back()
					}]
				);
			} catch (error) {
				console.error('Error in booking flow:', error);
				Alert.alert(
					'Error',
					'Failed to book session. Please try again.',
					[{ text: 'OK' }]
				);
			}
		};
	} else if (action === 'cancel') {
		headerText = 'Confirm Cancellation';
		if (activeSession.status === 'pending') {
			messageText =
				"Cancelling now will end your chat and you'll need to send a new session request.";
		} else if (activeSession.status === 'confirmed') {
			if (timeDiff !== null && timeDiff >= 2) {
				messageText =
					'Cancelling now will hurt your rating. Are you sure you want to cancel?';
			} else {
				messageText = 'Cancellation is non-refundable.';
			}
		}
		primaryButtonText = 'Cancel Session';
		primaryButtonColor = '#DC2626';
		onPrimaryPress = async () => {
			try {
				if (activeSession.status === 'pending') {
					await dispatch(declineSessionThunk(activeSession.id)).unwrap();
				} else if (activeSession.status === 'confirmed') {
					await dispatch(cancelSessionThunk(activeSession.id)).unwrap();
				}
				router.back();
			} catch (error) {
				console.error('Error cancelling session:', error);
				Alert.alert('Error', 'Failed to cancel session');
			}
		};
	} else if (action === 'change') {
		headerText = 'Confirm Change';
		if (activeSession.status === 'pending') {
			messageText =
				'Changing the time will send you to the session request page to update your request.';
			primaryButtonText = 'Change Time';
			primaryButtonColor = '#008DF4'; // blue
			onPrimaryPress = () =>
				router.push({
					pathname: '/request-sessions',
					params: {
						otherUserId: otherUser.id,
						sessionObj: JSON.stringify(activeSession),
					},
				});
		} else if (activeSession.status === 'confirmed') {
			if (timeDiff !== null && timeDiff >= 2) {
				messageText =
					'Your session needs to be rebooked. Please update your session details. (This may affect your rating.)';
			} else {
				messageText = 'Session change is non-refundable.';
			}
			primaryButtonText = 'Change Session';
			primaryButtonColor = '#DC2626'; // red
			onPrimaryPress = () =>
				router.push({
					pathname: '/request-sessions',
					params: {
						otherUserId: otherUser.id,
						sessionObj: JSON.stringify(activeSession),
					},
				});
		}
	}

	return (
		<SafeAreaView className="flex-1 bg-white">
			{/* Top Bar with Back Arrow */}
			<View className="flex-row items-center p-4">
				<TouchableOpacity onPress={onBackPress}>
					<Ionicons name="chevron-back" size={24} color="#000" />
				</TouchableOpacity>
			</View>

			{/* Main Content */}
			<View className="flex-1 justify-center items-center px-4">
				{/* Other User's Profile Photo */}
				<View className="mb-4">
					{otherUser.profilePhotoUrl ? (
						<Image
							source={{ uri: otherUser.profilePhotoUrl }}
							className="w-36 h-36 rounded-full"
						/>
					) : (
						<Image
							source={{ uri: 'https://via.placeholder.com/100' }}
							className="w-24 h-24 rounded-full"
						/>
					)}
				</View>

				{/* Header */}
				<View className="flex-row items-center mb-2">
					<Ionicons
						name={
							action === 'cancel'
								? 'alert-circle'
								: 'checkmark-circle'
						}
						size={30}
						color={action === 'cancel' ? '#DC2626' : '#008DF4'}
					/>
					<Text className="text-lg font-semibold ml-2">
						{headerText}
					</Text>
				</View>

				{/* Dynamic Message */}
				<Text className="text-sm text-gray-500 text-center mb-6">
					{messageText}
				</Text>

				{/* Action Buttons (Stacked Vertically) */}
				<View className="flex flex-col space-y-4">
					<TouchableOpacity
						onPress={onPrimaryPress}
						className="rounded-lg px-6 py-3"
						style={{ backgroundColor: primaryButtonColor }}
					>
						<Text className="text-white font-bold text-sm text-center">
							{primaryButtonText}
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={onBackPress}
						className="bg-black rounded-lg px-6 py-3"
					>
						<Text className="text-white font-bold text-sm text-center">
							Back to Chat
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	);
};

export default SessionConfirmation;
