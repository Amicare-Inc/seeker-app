import React, { useState } from 'react';
import { SafeAreaView, View, Text, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSessionConfirmation } from '@/features/sessions/hooks/useSessionConfirmation';
import { TermsOfUseLink, TermsOfUseModal } from '@/features/privacy/components/TermsOfUseModal';

const SessionConfirmation = () => {
	const { sessionId, action } = useLocalSearchParams();
	const { isReady, isLoading, uiContent } = useSessionConfirmation(sessionId, action);
	const [showTermsModal, setShowTermsModal] = useState(false);

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
			<View className="flex-1 justify-center items-center px-6">
				{/* Profile Photo */}
				<Image
					source={
						otherUser.profilePhotoUrl
							? { uri: otherUser.profilePhotoUrl }
							: require('@/assets/default-profile.png')
					}
					className="w-[120px] h-[120px] rounded-full mb-[24px]"
				/>

				{/* Header */}
				<View className="flex-row items-center mb-2">
					{action === 'cancel' && (
						<Ionicons
							name="alert-circle"
							size={30}
							color="#DC2626"
						/>
					)}
					<Text className="text-xl font-bold mb-[12px]">{headerText}</Text>
				</View>

				{/* Message */}
					<Text className="text-base text-grey-58 text-center mb-[24px]">{messageText}{" "}
						<TermsOfUseLink
								textStyle={{ fontSize: 16, fontWeight: '500' }}
								onPress={() => setShowTermsModal(true)}
						/>.
					</Text>

				<View className="h-[1px] bg-grey-9 w-full mb-[38px]"></View>

				<View className="mb-[52px]">
					<Text className="text-grey-58 text-sm font-medium">Cancellation Policy:</Text>
					<Text className="text-grey-58 text-sm font-medium">Our cancellation policy is determined by the time remaining before the session start time:</Text>
					<Text className="text-grey-58 text-sm">
						<Text className="font-bold">• More than 12 hours:</Text>
						<Text className="font-medium"> Full refund</Text>
					</Text>
					<Text className="text-grey-58 text-sm">
						<Text className="font-bold">• 4-12 hours:</Text>
						<Text className="font-medium"> 90% refund</Text>
					</Text>
					<Text className="text-grey-58 text-sm">
						<Text className="font-bold">• Less than 4 hours:</Text>
						<Text className="font-medium"> 50% refund</Text>
					</Text>
				</View>

				{/* Buttons */}
				<View className="flex flex-col space-y-4 w-full">
					<TouchableOpacity
						onPress={onPrimaryPress}
						className="rounded-xl px-6 py-4 flex-row justify-center items-center space-x-2 mb-[30px]"
						style={{ backgroundColor: primaryButtonColor }}
						disabled={isLoading}
					>
						<Ionicons name="checkmark-circle" size={24} color="white" />
						<Text className="text-white font-medium  text-xl text-center">
							{isLoading ? 'Processing...' : primaryButtonText}
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => router.back()}
						className=""
						disabled={isLoading}
					>
						<Text className="text-black font-medium text-base text-center underline">
							Back to Chat
						</Text>
					</TouchableOpacity>
				</View>
			</View>
			
			<TermsOfUseModal
				visible={showTermsModal}
				onClose={() => setShowTermsModal(false)}
			/>
		</SafeAreaView>
	);
};

export default SessionConfirmation;
