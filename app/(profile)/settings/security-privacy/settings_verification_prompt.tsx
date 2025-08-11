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


const VerificationPrompt: React.FC = () => {
   const dispatch = useDispatch<AppDispatch>();
   const userData = useSelector(((state: RootState) => state.user.userData));
   const [showPrivacyModal, setShowPrivacyModal] = useState(false);
   const [showTermsModal, setShowTermsModal] = useState(false);

   const handleVerify = () => {
	  router.push('/verification_webview'); // Route to the webview page
   };

   return (
	  <SafeAreaView className="flex-1 bg-grey-0">
			  {/* Header */}
			  <View className="flex-row items-center px-4">
				<TouchableOpacity onPress={() => router.back()} className="mr-4 absolute left-4">
				  <Ionicons name="chevron-back" size={24} color="black" />
				</TouchableOpacity>
				<View className="flex-1 items-center">
				  <Text className="text-xl font-medium"></Text>
				</View>
			  </View>
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
				  <Text className="text-xs text-grey-49 mb-[21px] leading-5 text-center mx-auto">
					{userData?.isPsw
					  ? 'To help ensure platform safety and build trust with care seekers, we ask for a selfie and a valid government-issued photo ID to confirm your identity.'
					  : 'To help ensure platform safety and build trust between users, we ask for a selfie and valid government-issued photo ID to confirm your identity.'}
					Your information is encrypted, stored securely, and only used as described in our <PrivacyPolicyLink onPress={() => setShowPrivacyModal(true)} textStyle={{ color: '#0c7ae2' }} />.
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
					{userData?.isPsw
					  ? 'By continuing, you give Amicare permission to collect, store, and share this information securely with our verification partners as outlined in our '
					  : 'By continuing, you consent to our collection and use of your identity information in accordance with our '}
					 <PrivacyPolicyLink onPress={() => setShowPrivacyModal(true)} textStyle={{ color: '#0c7ae2' }} /> and <TermsOfUseLink onPress={() => setShowTermsModal(true)} textStyle={{ color: '#0c7ae2' }} />.
				  </Text>
			   </View>
			   <CustomButton
				  title="Verify Now"
				  handlePress={handleVerify}
				  containerStyles="bg-black py-4 rounded-lg mb-4"
				  textStyles="text-white text-lg"
			   />
			   <PrivacyPolicyModal visible={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
			   <TermsOfUseModal visible={showTermsModal} onClose={() => setShowTermsModal(false)} />
			</View>
		 </View>
	  </SafeAreaView>
   );
};

export default VerificationPrompt;
