import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { EnrichedSession } from '@/types/EnrichedSession';
import { useActiveSession } from '@/lib/context/ActiveSessionContext';
import { useEnrichedSessions } from '@/features/sessions/api/queries';

const SessionCompleted = () => {
	const { sessionId } = useLocalSearchParams();
	const currentUser = useSelector((state: RootState) => state.user.userData);
	const { activeEnrichedSession } = useActiveSession();
	const { data: allSessions = [], refetch } = useEnrichedSessions(currentUser?.id);
	const activeSession = activeEnrichedSession || allSessions.find((s) => s.id === sessionId);
	const [retryCount, setRetryCount] = useState(0);

	// Brief retry if session data not immediately available (should be rare now)
	useEffect(() => {
		if (!activeSession && currentUser && sessionId && retryCount < 3) {
			            // Session data not found, retrying...
			const timer = setTimeout(() => {
				refetch();
				setRetryCount(prev => prev + 1);
			}, 500); // Shorter retry interval
			return () => clearTimeout(timer);
		}
	}, [activeSession, currentUser, sessionId, retryCount, refetch]);

	// Show loading briefly if no session data (should resolve quickly)
	if (!activeSession || !currentUser) {
		return (
			<SafeAreaView className="flex-1 justify-center items-center bg-white px-4">
				<Ionicons name="hourglass-outline" size={48} color="#6B7280" />
				<Text className="text-lg font-semibold text-gray-800 mt-4 text-center">
					Loading Session Details...
				</Text>
				{retryCount >= 3 && (
					<>
						<Text className="text-sm text-gray-500 mt-2 text-center">
							Unable to load session details
						</Text>
						<TouchableOpacity
							onPress={() => {
								if (currentUser?.isPsw) {
									router.push('/(dashboard)/(psw)/psw-home');
								} else {
									router.push('/(dashboard)/(seeker)/seeker-home');
								}
							}}
							className="bg-blue-500 rounded-lg px-6 py-3 mt-4"
						>
							<Text className="text-white font-semibold text-center">
								Go to Dashboard
							</Text>
						</TouchableOpacity>
					</>
				)}
			</SafeAreaView>
		);
	}

	// If we have session but no otherUser, show completion without user details
	if (!activeSession.otherUser) {
		return (
			<SafeAreaView className="flex-1 justify-center items-center bg-white px-4">
				<Ionicons name="checkmark-circle" size={48} color="#22C55E" />
				<Text className="text-xl font-bold text-gray-800 mt-4 text-center">
					Session Completed!
				</Text>
				<Text className="text-base text-gray-600 mt-2 text-center">
					Your session has been completed successfully.
				</Text>
				<TouchableOpacity
					onPress={() => {
						if (currentUser?.isPsw) {
							router.push('/(dashboard)/(psw)/psw-home');
						} else {
							router.push('/(dashboard)/(seeker)/seeker-home');
						}
					}}
					className="bg-blue-500 rounded-lg px-6 py-3 mt-6"
				>
					<Text className="text-white font-semibold text-center">
						Go to Dashboard
					</Text>
				</TouchableOpacity>
			</SafeAreaView>
		);
	}

	const otherUser = activeSession.otherUser;
	const onReportPress = () => {
		// TODO: Implement reporting functionality
		                    // Handle report functionality here
	};

	const goToDashboard = () => {
		if (currentUser.isPsw) {
			router.push('/(dashboard)/(psw)/psw-home');
		} else {
			router.push('/(dashboard)/(seeker)/seeker-home');
		}
	};

	return (
		<SafeAreaView className="flex-1 bg-white">
			{/* Main Content */}
			<View className="flex-1 justify-center items-center px-4">
				{/* Other User's Profile Photo */}
				<View className="mb-6">
					{otherUser?.profilePhotoUrl ? (
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
					Your session with {otherUser?.firstName || 'your caregiver'} has been completed successfully. 
					{currentUser.isPsw 
						? ' Payment has been processed to your account.'
						: ' Thank you for using Amicare.'
					}
				</Text>

				{/* Action Buttons */}
				<View className="w-full max-w-sm space-y-4">
					<TouchableOpacity
						onPress={goToDashboard}
						className="bg-blue-500 rounded-lg px-6 py-4"
					>
						<Text className="text-white font-semibold text-lg text-center">
							Go to Dashboard
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

				{/* Session Details */}
				<View className="mt-8 bg-gray-50 rounded-lg p-4 w-full max-w-sm">
					<Text className="text-sm text-gray-500 text-center">
						Session with {otherUser?.firstName || 'User'} {otherUser?.lastName || ''}
					</Text>
					{activeSession.note && (
						<Text className="text-sm text-gray-700 text-center mt-1">
							{activeSession.note}
						</Text>
					)}
					{activeSession.actualEndTime && (
						<Text className="text-xs text-gray-400 text-center mt-2">
							Completed at {new Date(activeSession.actualEndTime).toLocaleString()}
						</Text>
					)}
				</View>
			</View>
		</SafeAreaView>
	);
};

export default SessionCompleted; 