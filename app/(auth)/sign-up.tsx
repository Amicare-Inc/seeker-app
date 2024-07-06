import { View, Text, ScrollView, SafeAreaView } from 'react-native'
import { StatusBar } from "expo-status-bar";
import React, { useState } from 'react'
import ForumField from '@/components/ForumField';
import CustomButton from '@/components/CustomButton';
import { Link, router } from 'expo-router';

const SignUp = () => {

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  return (
    <SafeAreaView className="h-full bg-white" >
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="flex w-full h-full justify-center px-9">
          <Text className="text-3xl text-black font-normal text-left mb-3">
            Create an account
          </Text>
          <Text className="text-xs text-gray-500 font-normal text-left mb-4">
            Let's get started by filling out the from below
          </Text>
          <ForumField 
          title = "Email"
          value = {form.email}
          handleChangeText={(e) => setForm({...form, email: e})}
          otherStyles="mb-4"
          keyboardType="email-address"
          />
          <ForumField 
          title = "Password"
          value = {form.password}
          handleChangeText={(e) => setForm({...form, password: e})}
          otherStyles="mb-4"
          />
          <CustomButton 
          title="Sign Up"
          handlePress={() => router.push("/discover")}
          containerStyles= "mb-6"       
          />
          <View className="flex justify-center flex-row gap-2">
            <Text className="text-xs text-gray-500 font-normal text-center">
              Already have an account?
            </Text>
            <Link href="/sign-in" className="text-xs font-normal text-blue-900">
              Sign In here
            </Link>
          </View>
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#FFFFFF" style="dark" />
    </SafeAreaView>
  )
}

export default SignUp