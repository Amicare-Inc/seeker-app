import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import { StatusBar } from "expo-status-bar";
import React from 'react'
import CustomButton from '@/components/CustomButton';
import { router } from 'expo-router';

const PswIntro3 = () => {
    return (
        <SafeAreaView className="h-full bg-white" >
            <ScrollView contentContainerStyle={{ height: '100%' }}>
                <View className="flex w-full h-full justify-center items-center p-4">
                    <Text className="text-2xl text-black font-bold text-left mb-11">
                        Clock-In to Cash-Out
                    </Text>
                    <Text className="text-xs text-gray-500 font-normal text-left mb-4">
                        Clock in and out using the SupportLink app to track your shift hours. Payment 
                        is issued by PSW via email within 5 calendar days of your shift's start date. 
                        Remember to maintain your invoices for tax purposes, as T4s or T4As are not 
                        provided to contractors.
                    </Text>
                    <CustomButton 
                        title="Continue"
                        handlePress={() => router.push("/personal_details")}
                        containerStyles="w-full mt-11"
                    />
                </View>
            </ScrollView>
            <StatusBar backgroundColor="#FFFFFF" style="dark" />
        </SafeAreaView>
    )
}

export default PswIntro3