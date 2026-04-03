import {
	View,
	Text,
	ScrollView,
	SafeAreaView,
	KeyboardAvoidingView,
	TouchableOpacity,
	ActivityIndicator,
	Alert,
	Modal,
	Pressable,
} from 'react-native';
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
import { requestPasswordReset } from '@/lib/auth-operations';

const SignIn = () => {
	const dispatch = useDispatch<AppDispatch>();
	const [form, setForm] = useState({
		// email: "aisha.khan@example.com",
		// password: "asdfgh",
		// email: 'owen.lee@example.com',
		// password: 'asdfgh',
		email: '',
		password: '',
	});
	const userData = useSelector((state: RootState) => state.user.userData);
	const loading = useSelector((state: RootState) => state.user.loading);
	const reduxError = useSelector((state: RootState) => state.user.error);
	const initialNavComplete = useSelector(
		(state: RootState) => state.user.initialNavigationComplete,
	);
	const [localError, setLocalError] = useState('');
	const [resetModalVisible, setResetModalVisible] = useState(false);
	const [resetEmail, setResetEmail] = useState('');
	const [resetModalError, setResetModalError] = useState('');
	const [resetSending, setResetSending] = useState(false);

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

	const openResetModal = () => {
		if (loading) return;
		setResetModalError('');
		setResetEmail(form.email);
		setResetModalVisible(true);
	};

	const closeResetModal = () => {
		setResetModalVisible(false);
		setResetModalError('');
	};

	const handleResetEmailChange = (value: string) => {
		setResetEmail(value);
		setResetModalError('');
	};

	const handleSendResetFromModal = async () => {
		if (resetSending) return;
		setResetModalError('');
		const email = resetEmail.trim();
		if (!email) {
			setResetModalError('Please enter your email.');
			return;
		}
		setResetSending(true);
		try {
			await requestPasswordReset(email);
			Alert.alert(
				'Check your email',
				'If an account exists for that address, we sent a link to reset your password.',
			);
			closeResetModal();
			setResetEmail('');
		} catch (e: any) {
			setResetModalError(e?.message || 'Could not send reset email.');
		} finally {
			setResetSending(false);
		}
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
			console.log(' Sign-in successful, payload:', resultAction.payload);
			

			const userData = resultAction.payload;
			router.dismissAll();
			setTimeout(() => {
			}, 100);
			
			if (userData.onboardingComplete === true) {
			
				console.log('Navigating to seeker dashboard');
				router.replace('/(dashboard)/(seeker)/seeker-sessions');
				
			} else {
				console.log('Navigating to onboarding');
				router.replace('/(onboarding)/care_needs_1');
			}
		} else if (fetchUserFromLoginThunk.rejected.match(resultAction)) {
			// Error is handled by Redux and will appear in reduxError
			console.error('Sign-in failed:', resultAction.payload);
		}
		} catch (error: any) {
			console.error('Unexpected sign-in error:', error);
			setLocalError('An unexpected error occurred. Please try again.');
		}
	};
	const currentError = localError || reduxError;
	useEffect(() => {
		if (userData && userData.id) {
			console.log('Connecting socket for user:', userData.id);
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
							otherStyles="mb-2"
							editable={!loading}
						/>
						<View className="flex flex-row justify-end mb-4">
							<TouchableOpacity
								onPress={openResetModal}
								disabled={loading}
								accessibilityRole="button"
								accessibilityLabel="Forgot password"
							>
								<Text
									className={`text-xs font-normal ${loading ? 'text-gray-400' : 'text-blue-900'}`}
								>
									Forgot password?
								</Text>
							</TouchableOpacity>
						</View>
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
								onPress={() => router.replace('/(onboarding)/role_selection')}
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

			<Modal
				visible={resetModalVisible}
				animationType="slide"
				transparent
				onRequestClose={closeResetModal}
			>
				<KeyboardAvoidingView behavior="padding" className="flex-1 justify-end">
					<Pressable
						className="absolute inset-0 bg-black/50"
						onPress={closeResetModal}
						accessibilityRole="button"
						accessibilityLabel="Dismiss"
					/>
					<View className="bg-white rounded-t-3xl px-6 pt-5 pb-10">
						<View className="flex-row justify-between items-center mb-2">
							<Text className="text-xl text-black font-medium">Reset password</Text>
							<TouchableOpacity onPress={closeResetModal} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
								<Ionicons name="close" size={26} color="#111" />
							</TouchableOpacity>
						</View>
						<Text className="text-xs text-gray-500 mb-4">
							Enter your email and we will send you a link to choose a new password.
						</Text>
						{resetModalError ? (
							<View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
								<Text className="text-red-700 text-sm text-center">{resetModalError}</Text>
							</View>
						) : null}
						<ForumField
							title="Email"
							value={resetEmail}
							handleChangeText={handleResetEmailChange}
							otherStyles="mb-5"
							keyboardType="email-address"
							editable={!resetSending}
							autoCapitalize="none"
						/>
						<CustomButton
							title={resetSending ? 'Sending…' : 'Send reset link'}
							handlePress={handleSendResetFromModal}
							containerStyles={resetSending ? 'opacity-50 mb-3' : 'mb-3'}
						/>
						<TouchableOpacity onPress={closeResetModal} disabled={resetSending} className="py-2">
							<Text className="text-center text-sm text-gray-600">Cancel</Text>
						</TouchableOpacity>
					</View>
				</KeyboardAvoidingView>
			</Modal>
		</SafeAreaView>
	);
};

export default SignIn;
