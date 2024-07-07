import { View, Text, ScrollView, SafeAreaView, KeyboardAvoidingView } from 'react-native'
import { StatusBar } from "expo-status-bar";
import React, { useState } from 'react'
import ForumField from '@/components/ForumField';
import CustomButton from '@/components/CustomButton';
import { Link, router } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '@/firebase.config';

const SignUp = () => {

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState('');

  const handleSignUp = () => {
    createUserWithEmailAndPassword(FIREBASE_AUTH, form.email, form.password)
      .then(userCredential => {
        const user = userCredential.user;
        console.log('User signed up:', user);
        router.push("/role");
      })
      .catch(error => {
        setError(error.message);
        console.error('Error signing up:', error);
      });
  };

  return (
    <SafeAreaView className="h-full bg-white" >
      <KeyboardAvoidingView behavior="padding" style={{flex:1}}>
        <ScrollView contentContainerStyle={{ height: '100%' }}>
          <View className="flex w-full h-full justify-center px-9">
            <Text className="text-3xl text-black font-normal text-left mb-3">
              Create an account
            </Text>
            <Text className="text-xs text-gray-500 font-normal text-left mb-4">
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
              title="Sign Up"
              handlePress={handleSignUp}
              containerStyles="mb-6"
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
      </KeyboardAvoidingView>
      <StatusBar backgroundColor="#FFFFFF" style="dark" />
    </SafeAreaView>
  )
}

export default SignUp