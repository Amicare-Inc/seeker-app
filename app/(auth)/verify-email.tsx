import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Button, SafeAreaView, ScrollView } from 'react-native';
import {
	getAuth,
	onAuthStateChanged,
	sendEmailVerification,
} from 'firebase/auth';
import { useRouter, useFocusEffect } from 'expo-router';
import { CustomButton } from '@/shared/components';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { FIREBASE_AUTH } from '@/firebase.config';

const VerifyEmail = () => {
	const router = useRouter();
	// Prefer the configured auth instance
	const [user, setUser] = useState(FIREBASE_AUTH.currentUser);
	const [resendDisabled, setResendDisabled] = useState(false);
	const [countdown, setCountdown] = useState(0);
	const [isChecking, setIsChecking] = useState(false);

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

	// Poll using a fresh auth.currentUser reference each tick to avoid stale closures
	useEffect(() => {
		const current = FIREBASE_AUTH.currentUser;
		if (current && !current.emailVerified) {
			const interval = setInterval(async () => {
				const u = FIREBASE_AUTH.currentUser;
				await u?.reload();
				if (u?.emailVerified) {
					clearInterval(interval);
					router.push('/(onboarding)/care_needs_1');
				}
			}, 3000);
			return () => clearInterval(interval);
		}
	}, [router]);

	// Also re-check on screen focus
	useFocusEffect(
		useCallback(() => {
			let isActive = true;
			(async () => {
				try {
					const u = FIREBASE_AUTH.currentUser;
					await u?.reload();
					if (isActive && u?.emailVerified) {
						router.push('/(onboarding)/care_needs_1');
					} else {
						setUser(u || null);
					}
				} catch {}
			})();
			return () => { isActive = false; };
		}, [router])
	);

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

	const handleContinue = async () => {
		try {
			setIsChecking(true);
			const u = FIREBASE_AUTH.currentUser;
			await u?.reload();
			if (u?.emailVerified) {
				router.push('/(onboarding)/care_needs_1');
			} else {
				setUser(u || null);
			}
		} finally {
			setIsChecking(false);
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
						containerStyles={`w-full mb-3 ${resendDisabled ? 'bg-gray-300' : ''}`}
					/>

					{/* Manual Continue */}
					<CustomButton
						title={isChecking ? 'Checking...' : "I've verified, Continue"}
						handlePress={handleContinue}
						containerStyles={`w-full mb-6 ${isChecking ? 'opacity-50' : ''}`}
						isLoading={isChecking}
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
