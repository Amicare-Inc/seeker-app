import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StatusBar, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { CustomButton } from '@/shared/components';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { updateUserFields } from '@/redux/userSlice';
import { PrivacyPolicyLink, PrivacyPolicyModal } from '@/features/privacy';
import { TermsOfUseLink, TermsOfUseModal } from '@/features/privacy/components/TermsOfUseModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useEffect } from 'react';

import { useRouter, useSegments } from 'expo-router';


  

const { height: screenHeight } = Dimensions.get('window');

export default function Index() {
	const insets = useSafeAreaInsets();
	const router = useRouter();
	const segments = useSegments() as string[];
	const [redirecting, setRedirecting] = useState(true);

	useEffect(() => {
		// Only redirect if the skip flag is set
		if (process.env.EXPO_PUBLIC_SKIP_ONBOARDING === 'true') {
		// Make sure segments are initialized
		if (segments.length > 0) {
			router.replace('/dashboard/seeker-sessions');
		}
		} else {
		setRedirecting(false);
		}
	}, [segments]);

	// While redirecting, render nothing
	if (process.env.EXPO_PUBLIC_SKIP_ONBOARDING === 'true' && redirecting) {
		return null;
	}

	return (
		<View style={{ flex: 1, backgroundColor: '#F2F2F7' }}>
			<StatusBar hidden />

			<ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
				{/* Image Section */}
				<View style={{ height: screenHeight * 0.5, position: 'relative' }}>
					<Image
						source={require('@/assets/info_1.jpg')}
						style={{
							width: '100%',
							height: '100%',
							resizeMode: 'cover',
						}}
					/>
					<LinearGradient
						colors={['rgba(242,242,247,0)', 'rgba(242,242,247,1)']}
						style={{
							position: 'absolute',
							bottom: 0,
							left: 0,
							right: 0,
							height: '75%',
						}}
					/>
				</View>
				
				{/* Content Section */}
				<View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 120, marginTop: -36 }}>
					<Text className="text-[24px] font-semibold text-grey-80 mb-1">Welcome to Amicare</Text>
					<Text className="text-[24px] text-grey-80 mb-6">Your Trusted Care Marketplace</Text>
					<Text className="text-base text-grey-80 leading-6 pr-4">
						Amicare helps families find compatible caregivers for in-home support. Whether you need companionship, help around the house, or daily living support - you're in the right place.
					</Text>
				</View>
			</ScrollView>

			{/* Fixed Bottom Section */}
			<View style={{ 
				position: 'absolute', 
				bottom: insets.bottom, 
				left: 0, 
				right: 0, 
				backgroundColor: '#F2F2F7',
				paddingTop: 16,
				paddingBottom: 16
			}}>
				{/* Navigation Section */}
				<View style={{ 
					flexDirection: 'row', 
					alignItems: 'center', 
					justifyContent: 'flex-end',
					paddingHorizontal: 16,
					marginBottom: 24
				}}>
					<Text className="text-grey-80 font-light text-[20px] mr-2">Next</Text>
					<TouchableOpacity onPress={() => router.push('/(onboarding)/info_2')}>
						<Ionicons name="arrow-forward-circle" size={52} color="#0C7AE2" />
					</TouchableOpacity>
				</View>
				
				{/* Disclaimer Section */}
				<View style={{ 
					flexDirection: 'row', 
					paddingHorizontal: 16,
					alignItems: 'flex-start',
					paddingBottom: 8
				}}>
					<Ionicons name="information-circle" size={30} color="#BFBFC3" style={{ marginTop: 2, marginRight: 8 }}/>
					<Text className="font-medium text-[11px] text-grey-49 flex-1 leading-4">
						By continuing, you agree that Amicare is not a healthcare provider. We are a neutral platform connecting families to independent caregivers.
					</Text>
				</View>
			</View>
		</View>
	);
}