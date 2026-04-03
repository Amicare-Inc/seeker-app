import { View, Text, ScrollView, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ForumField, CustomButton } from '@/shared/components';
import { Link, router } from 'expo-router';
import { useDispatch } from 'react-redux';
import { updateUserFields } from '@/redux/userSlice';
import { AppDispatch } from '@/redux/store';
import { FIREBASE_AUTH } from '@/firebase.config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { AuthApi } from '@/features/auth/api/authApi';
import Ionicons from '@expo/vector-icons/Ionicons';

const SignUp = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [form, setForm] = useState({
        email: '',
        password: '',
        confirm_password: '',
        // email: 'martin.droruga@example.',
        // password: 'asdfgh',
        // confirm_password: 'asdfgh',
    });

    const [passwordError, setPasswordError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUp = async () => {
        if (form.password != form.confirm_password) {
            setPasswordError('Passwords do not match. Enter the same password in both fields.');
        } else if (form.password.length < 6) {
            setPasswordError(
                'Password must be at least 6 characters.',
            );
        } else {
            try {
                setIsLoading(true);
                setPasswordError('');
                // Step 1: Create backend user (which also creates Firebase user)
                const userId = await AuthApi.signUp(form.email, form.password, false);
                
                // Step 2: Sign in with Firebase to establish auth state
                await signInWithEmailAndPassword(
                    FIREBASE_AUTH,
                    form.email,
                    form.password
                );
                
                // Step 3: Update Redux with user ID
                dispatch(
                    updateUserFields({
                        id: userId,
                        email: form.email || '',
                    }),
                );
                
                // Navigate to email verification instead of directly to onboarding
                router.push('/(auth)/verify-email');
                // router.push('/(onboarding)/care_needs_1');
            } catch (error: any) {
                const msg = error?.message || '';
                const msgLower = msg.toLowerCase();
                const tooShort =
                    error.code === 'auth/invalid-password' ||
                    msgLower.includes('at least 6 characters') ||
                    msgLower.includes('at least 6 char');
                const tooWeakOrCommon =
                    error.code === 'auth/weak-password' ||
                    msgLower.includes('too weak') ||
                    msgLower.includes('password is too weak') ||
                    msgLower.includes('does not meet requirements');
                if (tooShort) {
                    setPasswordError(
                        'Password must be at least 6 characters.',
                    );
                } else if (tooWeakOrCommon) {
                    setPasswordError(
                        'That password is too weak or too common. Use a longer password that mixes uppercase and lowercase letters, numbers, and symbols. Avoid obvious words like "password" or simple sequences like "123456".',
                    );
                } else if (error.code === 'auth/invalid-email') {
                    setPasswordError('Please enter a valid email address.');
                } else if (
                    error.code === 'auth/email-already-in-use' ||
                    msg.includes('already exists') ||
                    msg.includes('Sign in instead')
                ) {
                    setPasswordError(
                        msg ||
                            'An account with this email already exists. Sign in instead, or use a different email address.',
                    );
                } else {
                    setPasswordError(msg || 'Sign-up failed');
                }
                console.log((error as any).message);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <SafeAreaView className="h-full bg-white">
            <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ flexGrow: 1, paddingVertical: 24 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View className="flex w-full min-h-full justify-center px-9">
                        <Text className="text-3xl text-black font-normal text-left mb-3">
                            Create an account
                        </Text>
                        <Text className="text-xs text-gray-500 font-normal text-left mb-4">
                            Let's get started by filling out the form below
                        </Text>
                        {passwordError ? (
                            <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                                <Text className="text-red-700 text-sm text-left">{passwordError}</Text>
                            </View>
                        ) : null}
                        <ForumField
                            title="Email"
                            value={form.email}
                            handleChangeText={(e) =>
                                setForm({ ...form, email: e })
                            }
                            otherStyles="mb-4"
                            keyboardType="email-address"
                            autoCapitalize="none"
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
                            title={isLoading ? "Creating..." : "Sign Up"}
                            handlePress={handleSignUp}
                            containerStyles={`mb-6 ${isLoading ? 'opacity-50' : ''}`}
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
                {isLoading && (
                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} className="bg-black/10 items-center justify-center">
                        <Ionicons name="hourglass" size={40} color="#0c7ae2" />
                        <Text className="mt-3 text-blue-600">Creating your account...</Text>
                    </View>
                )}
            </KeyboardAvoidingView>
            <StatusBar backgroundColor="#FFFFFF" style="dark" />
        </SafeAreaView>
    );
};

export default SignUp;
