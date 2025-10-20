import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSessionConfirmation } from '@/features/sessions/hooks/useSessionConfirmation';
import { TermsOfUseLink, TermsOfUseModal } from '@/features/privacy/components/TermsOfUseModal';
import { PrivacyPolicyLink, PrivacyPolicyModal } from '@/features/privacy/components/PrivacyPolicyModal';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { SafeAreaView } from 'react-native-safe-area-context';

const SessionConfirmation = () => {
	const insets = useSafeAreaInsets();
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

			{/* Scrollable Content */}
			<View className="flex-1 px-6">
				{/* Profile Photo */}
				<View className="items-center mt-2">
					<Image
						source={
							otherUser.profilePhotoUrl
								? { uri: otherUser.profilePhotoUrl }
								: require('@/assets/default-profile.png')
						}
						className="w-[100px] h-[100px] rounded-full mb-4"
					/>

					{/* Header */}
					<View className="flex-row items-center mb-3 justify-center">
						{action === 'cancel' && (
							<Ionicons
								name="alert-circle"
								size={24}
								color="#DC2626"
								style={{ marginRight: 8 }}
							/>
						)}
						<Text className="text-xl font-bold text-center">{headerText}</Text>
					</View>

					{/* Message */}
					<Text className="text-base text-grey-58 text-center mb-6">
						{messageText}{" "}
						<TermsOfUseLink
							textStyle={{ fontSize: 16, fontWeight: '500' }}
							onPress={() => setShowTermsModal(true)}
						/>.
					</Text>
				</View>

				<View className="h-[1px] bg-grey-9 w-full mb-6"></View>

				{/* Payment Info */}
				<View className="mb-6">
					<Text className="text-grey-58 text-sm font-medium mb-3">How Payments Work:</Text>

					<Text className="text-grey-58 text-xs mb-2">
						<Text className="font-bold">1. Payment Secured:</Text> When a care seeker books a session, payment is charged and held in Stripe's secure escrow.
					</Text>
					<Text className="text-grey-58 text-xs mb-2">
						<Text className="font-bold">2. Service Completed:</Text> The caregiver delivers the booked service.
					</Text>
					<Text className="text-grey-58 text-xs">
						<Text className="font-bold">3. Funds Released:</Text> After the session is confirmed complete in the app, funds are released from escrow after a 48-hour review period and paid to the caregiver's Stripe account.
					</Text>
				</View>
			</View>

			{/* Fixed Bottom Section */}
			<View className="px-6 pb-6 bg-white">
				<View className="flex-row gap-2 mb-4">
					<Ionicons name="information-circle" size={24} color="#BFBFC3" />
					<Text className="flex-1 text-[11px] text-grey-49 leading-4">
						By continuing, you agree that payments are held in Stripe escrow, released 48 hours after session confirmation (minus service fees), and that cancellations/refunds follow Amicare's{" "}
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
					className="rounded-xl px-6 py-4 flex-row justify-center items-center mb-3"
					style={{ backgroundColor: primaryButtonColor }}
					disabled={isLoading}
				>
					<Ionicons name="checkmark-circle" size={24} color="white" style={{ marginRight: 8 }} />
					<Text className="text-white font-medium text-lg text-center">
						{isLoading ? 'Processing...' : primaryButtonText}
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={() => router.back()}
					disabled={isLoading}
					className="py-2"
				>
					<Text className="text-black font-medium text-base text-center underline">
						Back to Chat
					</Text>
				</TouchableOpacity>
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
