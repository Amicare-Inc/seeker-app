import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import CustomButton from '@/components/Global/CustomButton';
import { router } from 'expo-router';

const PswIntro2 = () => {
	return (
		<SafeAreaView className="h-full bg-white">
			<ScrollView contentContainerStyle={{ height: '100%' }}>
				<View className="flex w-full h-full justify-center items-center p-4">
					<Text className="text-2xl text-black font-bold text-left mb-11">
						Navigating Shifts and Handling Emergencies
					</Text>
					<Text className="text-xs text-gray-500 font-normal text-left mb-4">
						Please direct any questions or concerns to the
						SupportLink customer success team. Timely communication
						is vital, especially if you're running late or facing
						issues with the SupportLink app. In emergencies
						requiring shift cancellations, notify us at least 48
						hours in advance. Inform the PSW team immediately if you
						can't attend a shift. Note, last-minute cancellations or
						no-shows incur a $100 fee due to their impact on service
						quality.
					</Text>
					<CustomButton
						title="Continue"
						handlePress={() => router.push('/psw_intro_3')}
						containerStyles="w-full mt-11"
					/>
				</View>
			</ScrollView>
			<StatusBar backgroundColor="#FFFFFF" style="dark" />
		</SafeAreaView>
	);
};

export default PswIntro2;
