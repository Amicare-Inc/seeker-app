import React, { useEffect, useState } from 'react';
import { View, Text, Button, SafeAreaView, ScrollView } from 'react-native';
import {
	getAuth,
	onAuthStateChanged,
	sendEmailVerification,
} from 'firebase/auth';
import { useRouter } from 'expo-router';
import { CustomButton } from '@/shared/components';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const VerifyEmail = () => {
	const router = useRouter();
	const auth = getAuth();
	const [user, setUser] = useState(auth.currentUser);
	const [resendDisabled, setResendDisabled] = useState(false);
	const [countdown, setCountdown] = useState(0);

	useEffect(() => {
		if (user && !user.emailVerified) {
			sendEmailVerification(user)
				.then(() => {
					console.log(
						'Verification email sent',
						'Please check your email to verify your account.',
					);
				})
				.catch((error) => {
					console.log('Error', error.message);
				});
		}
	}, [user]);

	useEffect(() => {
		if (user && !user.emailVerified) {
			const interval = setInterval(async () => {
				await user.reload();
				if (user.emailVerified) {
					clearInterval(interval);
					// Continue to onboarding after email verification
					router.push('/(onboarding)/care_needs_1');
				}
			}, 3000); // Check every 3 seconds

			return () => clearInterval(interval); // Clear interval on component unmount
		}
	}, [user, router]);

	useEffect(() => {
		if (countdown > 0) {
			const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
			return () => clearTimeout(timer);
		} else {
			setResendDisabled(false);
		}
	}, [countdown]);

	const handleButton = () => {
		if (user && !resendDisabled) {
			setResendDisabled(true);
			setCountdown(5); // 5 second cooldown
			sendEmailVerification(user)
				.then(() => {
					console.log(
						'Verification email resent',
						'Please check your email to verify your account.',
					);
				})
				.catch((error) => {
					console.log('Error', error.message);
					setResendDisabled(false);
					setCountdown(0);
				});
		}
	};

	return (
		<SafeAreaView className="h-full bg-white">
			<ScrollView contentContainerStyle={{ height: '100%' }}>
				<View className="flex w-full h-full justify-center items-center p-4">
					{/* Icon */}
					<View className="bg-blue-50 p-4 rounded-full mb-6">
						<Ionicons name="mail-outline" size={48} color="#2563eb" />
					</View>

					{/* Main Title */}
					<Text className="text-3xl text-black font-semibold text-center mb-3">
						Verify Your Email Address
					</Text>

					{/* Subtitle */}
					<Text className="text-xs text-gray-500 font-normal text-center mb-8 px-4">
						We've sent a verification email to{'\n'}
						<Text className="font-semibold text-black">{user?.email}</Text>
					</Text>

					{/* Instructions */}
					<View className="bg-gray-50 rounded-lg p-4 mb-6 w-full">
						<Text className="text-sm text-gray-700 font-normal text-center mb-3">
							Please check your email and click the verification link to continue.
						</Text>
						<Text className="text-xs text-gray-500 font-normal text-center">
							Can't find the email? Check your spam or junk folder.
						</Text>
					</View>

					{/* Resend Button */}
					<CustomButton
						title={resendDisabled ? `Resend in ${countdown}s` : "Resend verification email"}
						handlePress={handleButton}
						containerStyles={`w-full mb-6 ${resendDisabled ? 'bg-gray-300' : ''}`}
					/>

					{/* Security Notice */}
					<Text className="text-xs text-gray-400 font-normal text-center px-6">
						This verification helps us maintain a secure and trusted community. 
						By verifying your email, you agree to our Terms of Service and Privacy Policy.
					</Text>
				</View>
			</ScrollView>
			<StatusBar backgroundColor="#FFFFFF" style="dark" />
		</SafeAreaView>
	);
};

export default VerifyEmail;
