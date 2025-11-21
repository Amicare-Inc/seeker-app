import React, { useState } from 'react';
import {
	SafeAreaView,
	View,
	Text,
	Image,
	TouchableOpacity,
	ScrollView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { requestSession } from '@/features/sessions/api/sessionApi';
import { useApplyToSession } from '@/features/sessions/api/queries';

const SessionApplication = () => {
	const { otherUserId, sessionData } = useLocalSearchParams();
	const currentUser = useSelector((state: RootState) => state.user.userData);
	const sessionInfo = sessionData ? JSON.parse(sessionData as string) : null;
	const [isSubmitting, setIsSubmitting] = useState(false);
	const applyToSessionMutation = useApplyToSession();

	const handleBack = () => {
		router.back();
	};

	const handleSendApplication = async () => {
		if (!sessionInfo) {
			alert('Session data not found. Please try again.');
			return;
		}

		try {
			setIsSubmitting(true);

			if (sessionInfo.sessionId) {
				// Apply to an existing session using mutation
				await applyToSessionMutation.mutateAsync({
					sessionId: sessionInfo.sessionId as string,
					data: {},
				});
			} else {
				// Create a new session request
				await requestSession(sessionInfo.sessionData);
			}

			if (sessionInfo.sessionId) {
				
				router.replace('/(dashboard)/(seeker)/seeker-sessions');
			
			} else {
				router.push({ pathname: '/sent-request', params: { otherUserId } });
			}
		} catch (error) {
			console.error('Error sending session request:', error);
			alert('An error occurred while sending your request.');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleBackToSessions = () => {
		
		router.replace('/(dashboard)/(seeker)/seeker-sessions');
	
	};

	return (
		<SafeAreaView className="flex-1 bg-white">
			<View className="flex-row items-center p-4">
				<TouchableOpacity onPress={handleBack}>
					<Ionicons name="chevron-back" size={24} color="#000" />
				</TouchableOpacity>
				<Text className="ml-2 text-lg font-medium">Back</Text>
			</View>

			<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
				<View className="flex-1 items-center px-6 pt-8">
					<View className="mb-8">
						<Image
							source={
								currentUser?.profilePhotoUrl
									? { uri: currentUser.profilePhotoUrl }
									: require('@/assets/default-profile.png')
							}
							className="w-24 h-24 rounded-full"
						/>
					</View>

					<Text className="text-2xl font-semibold mb-6 text-center">
						Send Application
					</Text>

					<Text className="text-sm text-gray-600 text-center mb-8 leading-5">
						By clicking "Apply" you agree to the{' '}
						<Text className="text-blue-500 underline">Terms and Conditions</Text>.
					</Text>

					<View className="w-full mb-8">
						<Text className="text-sm text-gray-600 mb-2">
							Your profile will be sent to {sessionInfo?.receiverName || 'Jane'}.
						</Text>
						<Text className="text-sm text-gray-600 mb-1">
							Rate: ${sessionInfo?.rate || '25'}/hr
						</Text>
						<Text className="text-sm text-gray-600">
							Total: ${sessionInfo?.total || '264.20'}
						</Text>
					</View>
				</View>
			</ScrollView>

			<View className="px-6 pb-6">
				<TouchableOpacity
					onPress={handleSendApplication}
					disabled={isSubmitting}
					className={`bg-black rounded-xl py-4 items-center mb-4 ${
						isSubmitting ? 'opacity-50' : ''
					}`}
				>
					<View className="flex-row items-center">
						<Ionicons name="checkmark-circle" size={20} color="white" />
						<Text className="text-white font-semibold text-lg ml-2">
							{isSubmitting ? 'Sending...' : 'Send Application'}
						</Text>
					</View>
				</TouchableOpacity>

				<TouchableOpacity onPress={handleBackToSessions}>
					<Text className="text-center text-blue-500 text-base">
						Back to Sessions
					</Text>
				</TouchableOpacity>

				<View className="mt-6 flex-row items-center">
					<Ionicons name="filter" size={16} color="#ccc" />
				</View>
			</View>

			{isSubmitting && (
				<View
					style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
					className="bg-black/10 items-center justify-center"
				>
					<Ionicons name="hourglass" size={36} color="#0c7ae2" />
					<Text className="mt-2 text-blue-600">Sending your application...</Text>
				</View>
			)}
		</SafeAreaView>
	);
};

export default SessionApplication;
