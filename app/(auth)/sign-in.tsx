import { View, Text, ScrollView, SafeAreaView, KeyboardAvoidingView } from 'react-native'
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from 'react'
import ForumField from '@/components/ForumField';
import CustomButton from '@/components/CustomButton';
import { Link, router } from 'expo-router';
import { signInWithEmail } from '@/services/firebase/auth';
import { getUserDoc } from '@/services/firebase/firestore';
import { fetchUserById } from '@/redux/userSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';

const SignIn = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [form, setForm] = useState({
    email: "david.moore@example.com",
    password: "asdfgh",
  });
  const userData = useSelector((state: RootState) => state.user.userData);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmail(form.email, form.password);
      const user = userCredential.user;
      console.log('User signed in:', user);
      dispatch(fetchUserById(user.uid));
    } 
    catch (error) {
      setError((error as any).message);
      console.error('Error signing in:', error);
    }
  };

  useEffect(() => {
    if (userData) {
      console.log('User Data:', userData);
      if (userData.isPsw) {
          router.push('/(psw)/psw-home');
      } else {
          router.push('/(seeker)/seeker-home');
      }
  }}, [userData])

  return (
    <SafeAreaView className="h-full bg-white" >
      <KeyboardAvoidingView behavior="padding">
        <ScrollView contentContainerStyle={{ height: '100%' }}>
          <View className="flex w-full h-full justify-center px-9">
            <Text className="text-3xl text-black font-normal text-left mb-3">
              Welcome Back
            </Text>
            < Text className="text-xs text-gray-500 font-normal text-left mb-4">
              Let's get started by filling out the from below
            </Text>
            <ForumField
              title="Email"
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              otherStyles="mb-4"
              keyboardType="email-address"
            />
            <ForumField
              title="Password"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles="mb-4"
            />
            <CustomButton
              title="Sign In "
              handlePress={handleSignIn}
              containerStyles="mb-6"
            />
            <View className="flex justify-center flex-row gap-2">
              <Text className="text-xs text-gray-500 font-normal text-center">
                Don't have an account?
              </Text>
              <Link href="/sign-up" className="text-xs font-normal text-blue-900">
                Sign Up here
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <StatusBar backgroundColor="#FFFFFF" style="dark" />
    </SafeAreaView>
  )
}

export default SignIn