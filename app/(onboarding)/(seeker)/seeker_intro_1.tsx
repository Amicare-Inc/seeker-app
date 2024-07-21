import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import { StatusBar } from "expo-status-bar";
import React from 'react'
import CustomButton from '@/components/CustomButton';
import { router } from 'expo-router';

const SeekerIntro1 = () => {
    return (
        <SafeAreaView className="h-full bg-white" >
            <ScrollView contentContainerStyle={{ height: '100%' }}>
                <View className="flex w-full h-full justify-center items-center p-4">
                    <Text className="text-5xl text-black font-thin text-center mb-11">
                        SeekerIntro1
                    </Text>
                    <CustomButton
                        title="Continue with Email"
                        handlePress={() => router.push("/personal_details")}
                        containerStyles="w-full mt-11"
                    />
                </View>
            </ScrollView>
            <StatusBar backgroundColor="#FFFFFF" style="dark" />
        </SafeAreaView>
    )
}

export default SeekerIntro1