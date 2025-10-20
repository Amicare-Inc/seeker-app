import React, { useState } from 'react';
import { SafeAreaView, View, Text, Image, TouchableOpacity, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSessionConfirmation } from '@/features/sessions/hooks/useSessionConfirmation';
import { TermsOfUseLink, TermsOfUseModal } from '@/features/privacy/components/TermsOfUseModal';
import { PrivacyPolicyLink, PrivacyPolicyModal } from '@/features/privacy';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

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

	const handlePrimaryPress = () => {
		// Normalize action (could be string or array)
		const actionStr = Array.isArray(action) ? action[0] : action;
		
		// Debug logging
		console.log('🔍 session-confirmation - handlePrimaryPress called');
		console.log('🔍 userData?.isPsw:', userData?.isPsw);
		console.log('🔍 action (raw):', action);
		console.log('🔍 actionStr (normalized):', actionStr);
		console.log('🔍 userData?.stripeAccountId:', userData?.stripeAccountId);
		
		// Check if PSW has Stripe account set up before proceeding
		if (userData?.isPsw && actionStr === 'book' && !userData.stripeAccountId) {
			console.log('🚫 Blocking PSW - no Stripe account');
			Alert.alert(
				'Set up payments',
				'You need to complete Stripe payouts onboarding before booking.',
				[
					{ text: 'Cancel', style: 'cancel' },
					{ text: 'Set up now', onPress: () => router.replace('/(profile)/payouts/stripe-prompt') },
				]
			);
			return;
		}
		
		if (userData?.isPsw && actionStr !== 'cancel') {
			console.log('✅ PSW continuing to session-confirmation-2');
			router.replace(`/session-confirmation-2?sessionId=${sessionId}&action=${actionStr}`);
		} else {
			console.log('✅ Non-PSW calling onPrimaryPress');
			onPrimaryPress();
		}
	};

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
					<Text className="text-xl font-bold mb-3 text-center">{headerText}</Text>
					
					{/* Message */}
					<Text className="text-base text-grey-58 text-center mb-6">
						By continuing you agree to the{" "}
						<TermsOfUseLink
							textStyle={{ fontSize: 16, fontWeight: '500' }}
							onPress={() => setShowTermsModal(true)}
						/>
					</Text>
				</View>

				<View className="h-[1px] bg-grey-9 w-full mb-6"></View>

				{/* Cancellation Policy */}
				<View className="mb-6">
					<Text className="text-grey-58 text-sm font-medium mb-3">Cancellation Policy:</Text>
					
					{!userData?.isPsw ? (
						<>
							<Text className="text-grey-58 text-xs mb-2">
								<Text className="font-bold">More than 24 hours before:</Text> Full Refund to Care Seeker, $0 Payment to Caregiver
							</Text>
							<Text className="text-grey-58 text-xs mb-2">
								<Text className="font-bold">Between 12-24 hours before:</Text> 50% Refund to Care Seeker, 50% of Session Fee to Caregiver*
							</Text>
							<Text className="text-grey-58 text-xs">
								<Text className="font-bold">Less than 12 hours before (or no-show):</Text> No Refund to Care Seeker, 75% of Session Fee to Caregiver*
							</Text>
						</>
					) : (
						<Text className="text-grey-58 text-xs">
							If a caregiver cancels a confirmed booking, the care seeker gets a full refund.
							All cancellations are recorded. Repeated or last-minute cancellations may reduce your visibility in the marketplace and could lead to account suspension.
						</Text>
					)}
				</View>
			</View>

			{/* Fixed Bottom Section */}
			<View className="px-6 pb-6 bg-white">
				<View className="flex-row gap-2 mb-4">
					<Ionicons name="information-circle" size={24} color="#BFBFC3"/>
					<Text className="flex-1 text-[11px] text-grey-49 leading-4">
						By continuing, you agree that cancelling a confirmed booking issues a full refund, is recorded, 
						and may reduce visibility or lead to suspension, per Amicare's{" "}
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
					onPress={handlePrimaryPress}
					className="rounded-xl px-6 py-4 flex-row justify-center items-center mb-3"
					style={{ backgroundColor: primaryButtonColor }}
					disabled={isLoading}
				>
					{!userData?.isPsw && (
						<Ionicons name="checkmark-circle" size={24} color="white" style={{ marginRight: 8 }} />
					)}
					<Text className="text-white font-medium text-lg text-center">
						{isLoading ? 'Processing...' : (userData?.isPsw && action !== 'cancel' ? 'Continue' : primaryButtonText)}
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
