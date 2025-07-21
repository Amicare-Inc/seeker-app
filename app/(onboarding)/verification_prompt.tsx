import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomButton } from '@/shared/components';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { updateUserFields } from '@/redux/userSlice';

const VerificationPrompt: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const userData = useSelector(((state: RootState) => state.user.userData));

	const handleVerify = () => {
		router.push('/verification_webview'); // Route to the webview page
	};

	const handleSkip = () => {
		dispatch(updateUserFields({ idVerified: false })); // Set idVerified to false in Redux
		// Navigate based on role
		if (userData?.isPsw) {
			router.push('/stripe-onboarding');
		} else {
			router.push('/profile_details');
		} // Replace with the actual next page route
	};

	return (
		<SafeAreaView className="flex-1 bg-grey-0">
			<ScrollView
				contentContainerStyle={{
					flexGrow: 1,
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
							<Text className="text-3xl text-black font-normal mb-6">
					Verify Your Identity
				</Text>
							<View className="px-9 w-full pb-4">
				<CustomButton
					title="Verify Now"
					handlePress={handleVerify}
					containerStyles="bg-black py-4 rounded-lg mb-4"
					textStyles="text-white text-lg"
				/>

				<CustomButton
					title="Skip for Now"
					handlePress={handleSkip}
					containerStyles="bg-gray-300 py-4 rounded-lg"
					textStyles="text-black text-lg"
				/>
			</View>
	
				<Text className="text-[10px] text-gray-500 font-normal text-center mb-6 px-10 bottom-0 absolute">
					We use Persona to securely verify your identity. You may be asked to provide a government-issued ID, live selfie (biometric data), driver’s license and abstract, criminal record check (with vulnerable sector screening), vaccination record, First Aid certification, food safety certification, non-violent crisis intervention certificate, resume, and optionally a PSW/HSW or Community Support Worker certificate. This info is used to confirm your identity and meet safety and legal requirements.
				</Text>
			</ScrollView>

		</SafeAreaView>
	);
};

export default VerificationPrompt;
