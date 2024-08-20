import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import { StatusBar } from "expo-status-bar";
import React from 'react'

const Profile = () => {
    return (
        <SafeAreaView className="h-full bg-white" >
            <ScrollView contentContainerStyle={{ height: '100%' }}>
                <View className="flex w-full h-full justify-center items-center p-4">
                    <Text className="text-5xl text-black font-thin text-center mb-11">
                        Profile
                    </Text>
                </View>
            </ScrollView>
            <StatusBar backgroundColor="#FFFFFF" style="dark" />
        </SafeAreaView>
    )
}

export default Profile