import { View, Text, ScrollView, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import ForumField from '@/components/Global/ForumField';
import CustomButton from '@/components/Global/CustomButton';
import { Link, router } from 'expo-router';
import { verifyEmail } from '@/services/firebase/auth';
import { useDispatch } from 'react-redux';
import { updateUserFields } from '@/redux/userSlice';
import { AppDispatch } from '@/redux/store';
import { Auth } from '@/services/node-express-backend/auth';
import { Stack } from 'expo-router';

const SignUpForum = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [form, setForm] = useState({
        email: "martin.droruga@example.com",
        password: "asdfgh",
        confirm_password: "asdfgh"
        // email: '',
        // password: '',
        // confirm_password: '',
    });

    const [error, setError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleSignUp = async () => {
        if (form.password != form.confirm_password) {
            setPasswordError('Passwords do not match');
        } else {
            try {
                const user = await Auth.signUp(
                    form.email,
                    form.password,
                );
                verifyEmail(user);
                dispatch(
                    updateUserFields({
                        id: user,
                        email: form.email || '',
                    }),
                );
                router.push('/(onboarding)/personal_details');
            } catch (error) {
                setPasswordError((error as any).message);
                console.log((error as any).message);
            }
        }
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView className="h-full bg-white">
                <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                    <ScrollView contentContainerStyle={{ height: '100%' }}>
                        <View className="flex w-full h-full justify-center px-9">
                            <Text className="text-3xl text-black font-normal text-left mb-3">
                                Create an account
                            </Text>
                            <Text className="text-xs text-gray-500 font-normal text-left mb-4">
                                Let's get started by filling out the from below
                            </Text>
                            {passwordError ? (
                                <Text className="text-normal text-red-500 font-normal text-left mb-4">
                                    {passwordError}
                                </Text>
                            ) : null}
                            <ForumField
                                title="Email"
                                value={form.email}
                                handleChangeText={(e) =>
                                    setForm({ ...form, email: e })
                                }
                                otherStyles="mb-4"
                                keyboardType="email-address"
                            />
                            <ForumField
                                title="Password"
                                value={form.password}
                                handleChangeText={(e) =>
                                    setForm({ ...form, password: e })
                                }
                                otherStyles="mb-4"
                            />
                            <ForumField
                                title="Confirm Password"
                                value={form.confirm_password}
                                handleChangeText={(e) =>
                                    setForm({ ...form, confirm_password: e })
                                }
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
                                <Link
                                    href="/sign-in"
                                    className="text-xs font-normal text-blue-900"
                                >
                                    Sign In here
                                </Link>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                <StatusBar backgroundColor="#FFFFFF" style="dark" />
            </SafeAreaView>
        </>
    );
};

export default SignUpForum;