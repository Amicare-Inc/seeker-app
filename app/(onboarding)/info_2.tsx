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

const { height: screenHeight } = Dimensions.get('window');

export default function Index() {
	const insets = useSafeAreaInsets();
	return (
		<View style={{ flex: 1, backgroundColor: '#F2F2F7' }}>
			<StatusBar hidden />
			
			{/* Back Button */}
			<View style={{ position: 'absolute', top: 50, left: 16, zIndex: 10 }}>
				<TouchableOpacity onPress={() => router.back()}>
					<Ionicons name="chevron-back" size={24} color="#FFFFFF" />
				</TouchableOpacity>
			</View>

			<ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
				{/* Image Section */}
				<View style={{ height: screenHeight * 0.5, position: 'relative' }}>
					<Image
						source={require('@/assets/info_2.jpg')}
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
					<Text className="text-[24px] font-semibold text-grey-80 mb-1">What We Are</Text>
					<Text className="text-[24px] text-grey-80 mb-6">and What We're Not</Text>
					<Text className="text-base text-grey-80 leading-6 pr-4">
						Amicare connects careseekers to independent caregivers. We are a neutral marketplace. We do not employ caregivers - they are independent professionals. We are not a home care agency or healthcare provider.
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
					<TouchableOpacity onPress={() => router.push('/(onboarding)/info_3')}>
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
						By continuing, you agree all care arrangements are made directly between care seekers and caregivers. Amicare facilitates the connection – not the care.
					</Text>
				</View>
			</View>
		</View>
	);
}