import React from 'react';
import { SafeAreaView, View, Text, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSessionConfirmation } from '@/features/sessions/hooks/useSessionConfirmation';

const SessionConfirmation = () => {
	const { sessionId, action } = useLocalSearchParams();
	const { isReady, isLoading, uiContent } = useSessionConfirmation(sessionId, action);

	// Loading state
	if (isLoading) {
		return (
			<SafeAreaView className="flex-1 justify-center items-center bg-white">
				<Text>Loading...</Text>
			</SafeAreaView>
		);
	}

	// Error state
	if (!isReady || !uiContent) {
		return (
			<SafeAreaView className="flex-1 justify-center items-center bg-white">
				<Text>Session not found</Text>
			</SafeAreaView>
		);
	}

	const { headerText, messageText, primaryButtonText, primaryButtonColor, onPrimaryPress, otherUser } = uiContent;

	return (
		<SafeAreaView className="flex-1 bg-white">
			{/* Header */}
			<View className="flex-row items-center p-4">
				<TouchableOpacity onPress={() => router.back()}>
					<Ionicons name="chevron-back" size={24} color="#000" />
				</TouchableOpacity>
			</View>

			{/* Main Content */}
			<View className="flex-1 justify-center items-center px-4">
				{/* Profile Photo */}
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
						name={action === 'cancel' ? 'alert-circle' : 'checkmark-circle'}
						size={30}
						color={action === 'cancel' ? '#DC2626' : '#008DF4'}
					/>
					<Text className="text-lg font-semibold ml-2">{headerText}</Text>
				</View>

				{/* Message */}
				<Text className="text-sm text-gray-500 text-center mb-6">{messageText}</Text>

				{/* Buttons */}
				<View className="flex flex-col space-y-4">
					<TouchableOpacity
						onPress={onPrimaryPress}
						className="rounded-lg px-6 py-3"
						style={{ backgroundColor: primaryButtonColor }}
						disabled={isLoading}
					>
						<Text className="text-white font-bold text-sm text-center">
							{isLoading ? 'Processing...' : primaryButtonText}
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => router.back()}
						className="bg-black rounded-lg px-6 py-3"
						disabled={isLoading}
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
