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
				<Text className="text-3xl text-black font-normal mb-3">
					Verify Your Identity
				</Text>
				<Text className="text-sm text-gray-500 font-normal mb-6 text-center px-10">
					For security purposes, we need to verify your identity. You
					may skip this for now and do it later.
				</Text>
			</ScrollView>
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
		</SafeAreaView>
	);
};

export default VerificationPrompt;
