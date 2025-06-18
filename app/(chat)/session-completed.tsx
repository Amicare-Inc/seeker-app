import React from 'react';
import { SafeAreaView, View, Text, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { EnrichedSession } from '@/types/EnrichedSession';

const SessionCompleted = () => {
	const { sessionId } = useLocalSearchParams();
	const currentUser = useSelector((state: RootState) => state.user.userData);
	const activeSession = useSelector(
		(state: RootState) =>
			state.sessions.activeEnrichedSession ||
			state.sessions.allSessions.find((s) => s.id === sessionId),
	) as EnrichedSession | undefined;

	if (!activeSession || !currentUser || !activeSession.otherUser) {
		return (
			<SafeAreaView className="flex-1 justify-center items-center bg-white">
				<Text>Loading...</Text>
			</SafeAreaView>
		);
	}

	const otherUser = activeSession.otherUser;
	const onClosePress = () => router.back();
	const onReportPress = () => {
		// TODO: Implement reporting functionality
		console.log('Report button pressed for session:', sessionId);
	};

	return (
		<SafeAreaView className="flex-1 bg-white">
			{/* Main Content */}
			<View className="flex-1 justify-center items-center px-4">
				{/* Other User's Profile Photo */}
				<View className="mb-6">
					{otherUser.profilePhotoUrl ? (
						<Image
							source={{ uri: otherUser.profilePhotoUrl }}
							className="w-36 h-36 rounded-full"
						/>
					) : (
						<Image
							source={{ uri: 'https://via.placeholder.com/144' }}
							className="w-36 h-36 rounded-full"
						/>
					)}
				</View>

				{/* Success Icon and Header */}
				<View className="flex-row items-center mb-4">
					<Ionicons
						name="checkmark-circle"
						size={40}
						color="#22C55E"
					/>
					<Text className="text-2xl font-bold ml-3 text-gray-800">
						Session Completed
					</Text>
				</View>

				{/* Message */}
				<Text className="text-base text-gray-600 text-center mb-8 px-4 leading-6">
					Your session with {otherUser.firstName} has been completed successfully. 
					{currentUser.isPsw 
						? ' Payment has been processed to your account.'
						: ' Thank you for using Amicare.'
					}
				</Text>

				{/* Action Buttons */}
				<View className="w-full max-w-sm space-y-4">
					<TouchableOpacity
						onPress={onClosePress}
						className="bg-blue-500 rounded-lg px-6 py-4"
					>
						<Text className="text-white font-semibold text-lg text-center">
							Close
						</Text>
					</TouchableOpacity>
					
					<TouchableOpacity
						onPress={onReportPress}
						className="bg-gray-200 rounded-lg px-6 py-4"
					>
						<Text className="text-gray-700 font-medium text-lg text-center">
							Report an Issue
						</Text>
					</TouchableOpacity>
				</View>

				{/* Optional: Session Details */}
				<View className="mt-8 bg-gray-50 rounded-lg p-4 w-full max-w-sm">
					<Text className="text-sm text-gray-500 text-center">
						Session with {otherUser.firstName} {otherUser.lastName}
					</Text>
					{activeSession.note && (
						<Text className="text-sm text-gray-700 text-center mt-1">
							{activeSession.note}
						</Text>
					)}
				</View>
			</View>
		</SafeAreaView>
	);
};

export default SessionCompleted; 