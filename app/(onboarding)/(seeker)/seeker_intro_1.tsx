import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import CustomButton from '@/components/Global/CustomButton';
import { router } from 'expo-router';

const SeekerIntro1 = () => {
	return (
		<SafeAreaView className="h-full bg-white">
			<ScrollView contentContainerStyle={{ height: '100%' }}>
				<View className="flex w-full h-full justify-center items-center p-4">
					<Text className="text-2xl text-black font-bold text-left mb-11">
						Your Path to Reliable Elderly Support
					</Text>
					<Text className="text-xs text-gray-500 font-normal text-left mb-4">
						Our user-friendly app makes it easy to find and connect
						with experienced caregivers who can offer assistance
						with daily tasks, companionship, and specialized care
						services. Whether you require occasional support or
						ongoing assistance, our marketplace ensures reliability,
						flexibility, and peace of mind for you and your loved
						ones. Join us today to experience the convenience and
						reassurance of finding the perfect caregiver for your
						elderly support needs.
					</Text>
					<CustomButton
						title="Continue"
						handlePress={() => router.push('/seeker_intro_2')}
						containerStyles="w-full mt-11"
					/>
				</View>
			</ScrollView>
			<StatusBar backgroundColor="#FFFFFF" style="dark" />
		</SafeAreaView>
	);
};

export default SeekerIntro1;
