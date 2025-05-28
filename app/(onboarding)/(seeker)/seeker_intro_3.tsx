import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import CustomButton from '@/components/Global/CustomButton';
import { router } from 'expo-router';

const SeekerIntro3 = () => {
	return (
		<SafeAreaView className="h-full bg-white">
			<ScrollView contentContainerStyle={{ height: '100%' }}>
				<View className="flex w-full h-full justify-center items-center p-4">
					<Text className="text-2xl text-black font-bold text-left mb-11">
						Pay As You Go
					</Text>
					<Text className="text-xs text-gray-500 font-normal text-left mb-4">
						We make it effortless to pay for shorter or fractional
						shifts directly from your bank account. With transparent
						pricing and lower costs, our marketplace ensures that
						you receive top-quality support without breaking the
						bank.
					</Text>
					<CustomButton
						title="Complete Your Profile"
						handlePress={() => router.push('/personal_details')}
						containerStyles="w-full mt-11"
					/>
				</View>
			</ScrollView>
			<StatusBar backgroundColor="#FFFFFF" style="dark" />
		</SafeAreaView>
	);
};

export default SeekerIntro3;
