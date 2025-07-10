import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { CustomButton } from '@/shared/components';
import { router } from 'expo-router';

const PswIntro1 = () => {
	return (
		<SafeAreaView className="h-full bg-white">
			<ScrollView contentContainerStyle={{ height: '100%' }}>
				<View className="flex w-full h-full justify-center items-center p-4">
					<Text className="text-2xl text-black font-bold text-left mb-11">
						Elevate Elderly Support With Us
					</Text>
					<Text className="text-xs text-gray-500 font-normal text-left mb-4">
						As an independent contractor, you have the freedom to
						accept or decline shifts within the app at your
						discretion. There are no minimum requirements for shift
						acceptance, and you're free to engage in other
						marketplaces concurrently. Upon selection for a shift,
						you'll receive a notification in the SupportLink app,
						prompting you to confirm your availability.
					</Text>
					<CustomButton
						title="Continue"
						handlePress={() => router.push('/psw_intro_2')}
						containerStyles="w-full mt-11"
					/>
				</View>
			</ScrollView>
			<StatusBar backgroundColor="#FFFFFF" style="dark" />
		</SafeAreaView>
	);
};

export default PswIntro1;
