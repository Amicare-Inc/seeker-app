import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import CustomButton from '@/components/Global/CustomButton';
import { router } from 'expo-router';

const SeekerIntro2 = () => {
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
						is vital, especially if there has been a change in plans
						or issues with the SupportLink app. In emergencies
						requiring shift cancellations, notify us at least 24
						hours in advance. Note, last-minute cancellations incur
						a $100 fee due to their impact on service quality.
					</Text>
					<CustomButton
						title="Continue"
						handlePress={() => router.push('/seeker_intro_3')}
						containerStyles="w-full mt-11"
					/>
				</View>
			</ScrollView>
			<StatusBar backgroundColor="#FFFFFF" style="dark" />
		</SafeAreaView>
	);
};

export default SeekerIntro2;
