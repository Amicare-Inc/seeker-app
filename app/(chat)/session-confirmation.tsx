import React, { useState } from 'react';
import { SafeAreaView, View, Text, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSessionConfirmation } from '@/features/sessions/hooks/useSessionConfirmation';
import { TermsOfUseLink, TermsOfUseModal } from '@/features/privacy/components/TermsOfUseModal';
import { PrivacyPolicyLink, PrivacyPolicyModal } from '@/features/privacy';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

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

	const handlePrimaryPress = () => {
		if (userData?.isPsw && action !== 'cancel') {
			router.replace(`/session-confirmation-2?sessionId=${sessionId}&action=${action}`);
		} else {
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
				<View className="flex-row items-center mb-2 justify-center">
					<Text className="text-xl font-bold mb-[12px]">{headerText}</Text>
				</View>

				{/* Message */}
				<Text className="text-base text-grey-58 text-center mb-[44px]">
					By continuing you agree to the{" "}
					<TermsOfUseLink
						textStyle={{ fontSize: 16, fontWeight: '500' }}
						onPress={() => setShowTermsModal(true)}
					/>
				</Text>

				<View className="h-[1px] bg-grey-9 w-full mb-[38px]"></View>

				<View className="mb-[52px]">
					<Text className="text-grey-58 text-sm font-medium mb-2">Cancellation Policy:</Text>
					
					{!userData?.isPsw ? (
						<>
							<Text className="text-grey-58 text-xs">
								<Text className="font-bold">More than 24 hours before the session starts:</Text> Full Refund to Care Seeker, $0 Payment to Caregiver
							</Text>
							<Text className="text-grey-58 text-xs">
								<Text className="font-bold">Between 12 and 24 hours before the session starts:</Text> 50% Refund to Care Seeker, 50% of the Session Fee to Caregiver*
							</Text>
							<Text className="text-grey-58 text-xs">
								<Text className="font-bold">Less than 12 hours before the session starts (or a no-show):</Text> No Refund to Care Seeker, 75% of the Session Fee to Caregiver*
							</Text>
						</>
					) : (
						<Text className="text-grey-58 text-sm mb-[30px]">
							If a caregiver cancels a confirmed booking, the care seeker gets a full refund.
							All cancellations are recorded. Repeated or last-minute cancellations may reduce your visibility in the marketplace and could lead to account suspension.
						</Text>
					)}
				</View>

				{/* Buttons */}
				<View className="flex flex-col w-full">
					<View className="flex-row gap-2 mr-10">
						<Ionicons name="information-circle" size={30} color="#BFBFC3"/>
						<Text className="font-medium text-[11px] text-grey-49 mb-[20px]">
							By continuing, you agree that cancelling a confirmed booking issues a full refund, is recorded, 
							and may reduce visibility or lead to suspension, per Amicare’s{" "}
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
						className="rounded-xl px-6 py-4 flex-row justify-center items-center mb-[20px]"
						style={{ backgroundColor: primaryButtonColor }}
						disabled={isLoading}
					>
						{!userData?.isPsw && (
							<Ionicons name="checkmark-circle" size={24} color="white" />
						)}
						<Text className="text-white font-medium text-xl text-center">
							{isLoading ? 'Processing...' : (userData?.isPsw && action !== 'cancel' ? 'Continue' : primaryButtonText)}
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
