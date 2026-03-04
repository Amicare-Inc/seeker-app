import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { CustomButton } from '@/shared/components';
import { router } from 'expo-router';

const Role = () => {
	return (
		<SafeAreaView className="h-full bg-white">
			<ScrollView contentContainerStyle={{ height: '100%' }}>
				<View className="flex w-full h-full justify-center items-center px-4">
					<Text className="text-3xl text-black font-semibold text-center mb-3">
						Welcome, {'\n'} Care Seeker
					</Text>
					<Text className="text-xs text-gray-500 font-normal text-center mb-4">
						Find trusted Personal Support {'\n'} Workers near you.
					</Text>
					<CustomButton
						title="Continue as a Care Seeker"
						handlePress={() => router.push('/personal_details')}
						containerStyles="w-full mb-5"
						textStyles="text-sm"
					/>
				</View>
			</ScrollView>
			<StatusBar backgroundColor="#FFFFFF" style="dark" />
		</SafeAreaView>
	);
};

export default Role;
