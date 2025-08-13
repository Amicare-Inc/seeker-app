import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomButton } from '@/shared/components';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { updateUserFields } from '@/redux/userSlice';
import { Ionicons } from '@expo/vector-icons';
import { PrivacyPolicyLink, PrivacyPolicyModal } from '@/features/privacy';
import { TermsOfUseLink, TermsOfUseModal } from '@/features/privacy/components/TermsOfUseModal';

const StripePromptPayouts: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const userData = useSelector(((state: RootState) => state.user.userData));
	const [showPrivacyModal, setShowPrivacyModal] = useState(false);
	const [showTermsModal, setShowTermsModal] = useState(false);

	const handleSetupPayments = () => {
		router.push('/(profile)/payouts/stripe-onboarding');
	};

	const handleSkip = () => {
		// Keep parity with original prompt; ensure clean navigation back to PSW profile
		dispatch(updateUserFields({} as any));
		router.replace('/(dashboard)/(psw)/psw-profile');
	};

	return (
		<SafeAreaView className="flex-1 bg-grey-0">
			<View style={{ flex: 1 }}>
				<TouchableOpacity onPress={handleSkip} style={{ position: 'absolute', top: 8, left: 8, zIndex: 50, padding: 8 }}>
					<Ionicons name="chevron-back" size={24} color="black" />
				</TouchableOpacity>
				<ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled">
					<View className="px-[16px] w-full" style={{ maxWidth: 480, alignSelf: 'center' }}>
						{/* Header */}
						<View className="flex-row items-center justify-center mb-[17px] relative">
							<Text className="text-2xl font-bold text-center text-black">
								Complete Your Payment Profile
							</Text>
						</View>

						{/* Subtitle */}
						<Text className="text-xs text-grey-49 mb-[30px] leading-5 text-center mx-auto">
							To receive payments and work on Amicare, you must complete your payment profile through our trusted partner, Stripe. This step is required by financial regulations to confirm your identity and set up secure deposits to your bank account.
						</Text>
					</View>
				</ScrollView>
				{/* Privacy Policy Notice and Buttons at the bottom */}
				<View className="px-[16px] pb-[21px] w-full" style={{ maxWidth: 480, alignSelf: 'center' }}>
					<View style={{ flexDirection: 'row', marginBottom: 18 }}>
						<Ionicons
							name="information-circle"
							size={22}
							color="#BFBFC3"
							style={{ marginRight: 6 }}
						/>
						<Text style={{ flex: 1, fontSize: 11, color: '#7B7B7E', lineHeight: 15, fontWeight: '500' }}>
							By continuing, you understand and agree that Stripe will collect and process your personal information to verify your identity, as described in Stripe's Privacy Policy and Amicare's{' '}
							<TermsOfUseLink onPress={() => setShowTermsModal(true)} textStyle={{ color: '#0c7ae2' }} />. This process is required to use the platform as a caregiver.
						</Text>
					</View>
					<CustomButton
						title="Set Up Payments"
						handlePress={handleSetupPayments}
						containerStyles="bg-black py-4 rounded-lg mb-4 flex items-center justify-center"
						textStyles="text-white text-lg"
					/>
					<PrivacyPolicyModal visible={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
					<TermsOfUseModal visible={showTermsModal} onClose={() => setShowTermsModal(false)} />
				</View>
			</View>
		</SafeAreaView>
	);
};

export default StripePromptPayouts; 