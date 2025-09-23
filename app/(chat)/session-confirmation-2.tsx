import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSessionConfirmation } from '@/features/sessions/hooks/useSessionConfirmation';
import { TermsOfUseLink, TermsOfUseModal } from '@/features/privacy/components/TermsOfUseModal';
import { PrivacyPolicyLink, PrivacyPolicyModal } from '@/features/privacy/components/PrivacyPolicyModal';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { SafeAreaView } from 'react-native-safe-area-context';

const SessionConfirmation = () => {
	const { sessionId, action } = useLocalSearchParams();
	const { isReady, isLoading, uiContent } = useSessionConfirmation(sessionId, action);
	const [showTermsModal, setShowTermsModal] = useState(false);
	const [showPrivacyModal, setShowPrivacyModal] = useState(false);
	const userData = useSelector((state: RootState) => state.user.userData);

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
			<View className="flex-1 items-center px-6">
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
				<View className="flex-row items-center justify-center mb-2">
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
				<Text className="text-base text-grey-58 text-center mb-[24px]">
					{messageText}{" "}
					<TermsOfUseLink
						textStyle={{ fontSize: 16, fontWeight: '500' }}
						onPress={() => setShowTermsModal(true)}
					/>.
				</Text>

				<View className="h-[1px] bg-grey-9 w-full mb-[38px]"></View>

				<View className="mb-[52px]">
					<Text className="text-grey-58 text-sm font-medium mb-2">How Payments Work:</Text>

					<Text className="text-grey-58 text-xs mb-2">
						<Text className="font-bold">1. Payment Secured:</Text> When a care seeker books a session, payment is charged and held in Stripe’s secure escrow.
					</Text>
					<Text className="text-grey-58 text-xs mb-2">
						<Text className="font-bold">2. Service Completed:</Text> The caregiver delivers the booked service.
					</Text>
					<Text className="text-grey-58 text-xs">
						<Text className="font-bold">3. Funds Released:</Text> After the session is confirmed complete in the app, funds are released from escrow after a 48-hour review period and paid to the caregiver’s Stripe account.
					</Text>
				</View>

				{/* Buttons */}
				<View className="flex flex-col w-full">
					<View className="flex-row gap-1 mr-8">
						<Ionicons name="information-circle" size={30} color="#BFBFC3" />
						<Text className="font-medium text-[11px] text-grey-49 mb-[20px]">
							By continuing, you agree that payments are held in Stripe escrow, released 48 hours after session confirmation (minus service fees), and that cancellations/refunds follow Amicare’s{" "}
							<TermsOfUseLink
								textStyle={{ fontSize: 11, fontWeight: '500' }}
								onPress={() => setShowTermsModal(true)}
							/>{" and "}
							<PrivacyPolicyLink
								textStyle={{ fontSize: 11, fontWeight: '500' }}
								onPress={() => setShowPrivacyModal(true)}
							/>.
						</Text>
					</View>

					<TouchableOpacity
						onPress={onPrimaryPress}
						className="rounded-xl px-6 py-4 flex-row justify-center items-center space-x-2 mb-[20px]"
						style={{ backgroundColor: primaryButtonColor }}
						disabled={isLoading}
					>
						<Ionicons name="checkmark-circle" size={24} color="white" />
						<Text className="text-white font-medium text-xl text-center">
							{isLoading ? 'Processing...' : primaryButtonText}
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={() => router.back()}
						disabled={isLoading}
					>
						<Text className="text-black font-medium text-base text-center underline">
							Back to Chat
						</Text>
					</TouchableOpacity>
				</View>
			</View>

			{/* Modals */}
			<TermsOfUseModal
				visible={showTermsModal}
				onClose={() => setShowTermsModal(false)}
			/>
			<PrivacyPolicyModal
				visible={showPrivacyModal}
				onClose={() => setShowPrivacyModal(false)}
			/>
		</SafeAreaView>
	);
};

export default SessionConfirmation;
