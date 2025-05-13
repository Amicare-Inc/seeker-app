import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import CustomButton from '@/components/CustomButton';
import { router } from 'expo-router';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebase.config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, setDoc } from 'firebase/firestore';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { updateUserFields } from '@/redux/userSlice';

const Role = () => {
	const dispatch = useDispatch<AppDispatch>();
	const handleButtons = async (isPsw: boolean) => {
		dispatch(updateUserFields({ isPsw }));
		router.push('/personal_details');
	};

	return (
		<SafeAreaView className="h-full bg-white">
			<ScrollView contentContainerStyle={{ height: '100%' }}>
				<View className="flex w-full h-full justify-center items-center px-4">
					<Text className="text-3xl text-black font-semibold text-center mb-3">
						Get Started: Define {'\n'} Your Role
					</Text>
					<Text className="text-xs text-gray-500 font-normal text-center mb-4">
						Are You a Personal Support Worker or in {'\n'} Need of
						Support?
					</Text>
					<CustomButton
						title="Join Our Team of PSWs"
						handlePress={() => {
							handleButtons(true);
						}}
						containerStyles="w-full bg-orange-500 mb-5"
						textStyles="text-sm"
					/>
					<CustomButton
						title="Connect with Trusted Caregivers"
						handlePress={() => {
							handleButtons(false);
						}}
						containerStyles="w-full bg-blue-600"
						textStyles="text-sm"
					/>
				</View>
			</ScrollView>
			<StatusBar backgroundColor="#FFFFFF" style="dark" />
		</SafeAreaView>
	);
};

export default Role;
