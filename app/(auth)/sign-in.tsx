import { View, Text, ScrollView, SafeAreaView, KeyboardAvoidingView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ForumField } from '@/shared/components';
import { CustomButton } from '@/shared/components';
import { Link, router } from 'expo-router';
import { fetchUserFromLoginThunk, setNavigationComplete, clearError } from '@/redux/userSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { connectSocket } from '@/src/features/socket';
import { Ionicons } from '@expo/vector-icons';

const SignIn = () => {
	const dispatch = useDispatch<AppDispatch>();
	const [form, setForm] = useState({
		// email: "aisha.khan@example.com",
		// password: "asdfgh",
		email: 'owen.lee@example.com',
		password: 'asdfgh',
	});
	const userData = useSelector((state: RootState) => state.user.userData);
	const loading = useSelector((state: RootState) => state.user.loading);
	const reduxError = useSelector((state: RootState) => state.user.error);
	const initialNavComplete = useSelector(
		(state: RootState) => state.user.initialNavigationComplete,
	);
	const [localError, setLocalError] = useState('');

	// Clear errors when user starts typing
	const handleEmailChange = (email: string) => {
		setForm({ ...form, email });
		setLocalError('');
		dispatch(clearError()); // Clear Redux error
	};

	const handlePasswordChange = (password: string) => {
		setForm({ ...form, password });
		setLocalError('');
		dispatch(clearError()); // Clear Redux error
	};

	const handleSignIn = async () => {
		try {
			setLocalError(''); // Clear any previous errors
			
			// Basic validation
			if (!form.email || !form.password) {
				setLocalError('Please enter both email and password');
				return;
			}

			const resultAction = await dispatch(fetchUserFromLoginThunk({
				email: form.email, 
				password: form.password
			}));
			
			if (fetchUserFromLoginThunk.fulfilled.match(resultAction)) {
				console.log('Sign-in successful:', resultAction.payload);
			} else if (fetchUserFromLoginThunk.rejected.match(resultAction)) {
				// Error is handled by Redux and will appear in reduxError
				console.error('Sign-in failed:', resultAction.payload);
			}
		} catch (error: any) {
			console.error('Unexpected sign-in error:', error);
			setLocalError('An unexpected error occurred. Please try again.');
		}
	};

	// Get the current error to display (prioritize local error, then Redux error)
	const currentError = localError || reduxError;

	useEffect(() => {
		if (!initialNavComplete && userData) {
			if (userData.onboardingComplete == true) {
				dispatch(setNavigationComplete(true));
				if (userData.isPsw == true) {
					router.push('/(psw)/psw-home');
				} else if (userData.isPsw == false) {
					router.push('/(seeker)/seeker-home');
				}
			}
		}
		if (userData && userData.id) {
			connectSocket(userData.id);
		}
	}, [userData]);

	return (
		<SafeAreaView className="h-full bg-white">
			{/* Loading Overlay */}
			{loading && (
				<View className="absolute top-0 left-0 right-0 bottom-0 bg-grey-0 z-50 flex items-center justify-center">
					<View className="bg-white rounded-lg p-6 flex items-center">
						<ActivityIndicator size="large" color="#000" />
						<Text className="text-black text-lg font-medium mt-3">Signing In...</Text>
						<Text className="text-gray-500 text-sm mt-1">Please wait</Text>
					</View>
				</View>
			)}

			<KeyboardAvoidingView behavior="padding">
				<ScrollView contentContainerStyle={{ height: '100%' }}>
					<View className="flex w-full h-full justify-center px-9">
						<Text className="text-3xl text-black font-normal text-left mb-3">
							Welcome Back
						</Text>
						<Text className="text-xs text-gray-500 font-normal text-left mb-4">
							Let's get started by filling out the form below
						</Text>
						
						{/* Error Message Display */}
						{currentError && (
							<View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
								<Text className="text-red-700 text-sm text-center">
									{currentError}
								</Text>
							</View>
						)}
						
						<ForumField
							title="Email"
							value={form.email}
							handleChangeText={handleEmailChange}
							otherStyles="mb-4"
							keyboardType="email-address"
							editable={!loading}
						/>
						<ForumField
							title="Password"
							value={form.password}
							handleChangeText={handlePasswordChange}
							otherStyles="mb-4"
							editable={!loading}
						/>
						<CustomButton
							title={loading ? "Signing In..." : "Sign In"}
							handlePress={handleSignIn}
							containerStyles={`mb-6 ${loading ? 'opacity-50' : ''}`}
						/>
						<View className="flex justify-center flex-row gap-2">
							<Text className="text-xs text-gray-500 font-normal text-center">
								Don't have an account?
							</Text>
							<TouchableOpacity 
								onPress={() => router.replace('/sign-up')}
								disabled={loading}
							>
								<Text className={`text-xs font-normal ${loading ? 'text-gray-400' : 'text-blue-900'}`}>
									Sign Up here
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
			<StatusBar backgroundColor="#FFFFFF" style="dark" />
		</SafeAreaView>
	);
};

export default SignIn;
