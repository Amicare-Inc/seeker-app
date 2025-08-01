import React, { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomButton } from '@/shared/components';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { updateUserFields } from '@/redux/userSlice';
import { Ionicons } from '@expo/vector-icons';
import { PrivacyPolicyLink, PrivacyPolicyModal } from '@/features/privacy';


const VerificationPrompt: React.FC = () => {
   const dispatch = useDispatch<AppDispatch>();
   const userData = useSelector(((state: RootState) => state.user.userData));
   const [showPrivacyModal, setShowPrivacyModal] = useState(false);

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
	  }
   };

   return (
	  <SafeAreaView className="flex-1 bg-grey-0">
		 <View style={{ flex: 1 }}>
			<ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled">
			   <View className="px-[16px] w-full" style={{ maxWidth: 480, alignSelf: 'center' }}>
				  {/* Header */}
				  <View className="flex-row items-center justify-center mb-[17px] relative">
					 <Text className="text-2xl font-bold text-center text-black">
						Verify Your Identity
					 </Text>
				  </View>

				  {/* Subtitle */}
				  <Text className="text-sm text-grey-80 mb-[21px] leading-5 text-center mx-auto">
					 {userData?.isPsw
						? 'You will be asked to take a selfie for biometric verification, and also asked to present your certifications and background checks (Vulnerable Sector Check, First Aid, etc).'
						: 'You will be asked to take a selfie for biometric verification and present your government-issued ID.'}
				  </Text>
			   </View>
			</ScrollView>
			{/* Privacy Policy Notice and Buttons at the bottom */}
			<View className="px-[16px] pb-[21px] w-full" style={{ maxWidth: 480, alignSelf: 'center' }}>
			   <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }}>
				  <Ionicons
					 name="information-circle"
					 size={22}
					 color="#BFBFC3"
					 style={{ marginRight: 6 }}
				  />
				  <Text style={{ flex: 1, fontSize: 11, color: '#7B7B7E', lineHeight: 15, fontWeight: '500' }}>
					 By continuing, you agree to our{' '}
					 <PrivacyPolicyLink onPress={() => setShowPrivacyModal(true)} textStyle={{ color: '#0c7ae2' }} />
					 <Text className="text-brand-blue">.</Text>
				  </Text>
			   </View>
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
			   <PrivacyPolicyModal visible={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
			</View>
		 </View>
	  </SafeAreaView>
   );
};

export default VerificationPrompt;
