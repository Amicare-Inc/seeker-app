import React, { useState, useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { StripeOnboardingService } from '@/services/stripe/onboarding-service';
import { CustomButton } from '@/shared/components';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

const StripeOnboardingPayouts: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const userData = useSelector((state: RootState) => state.user.userData);
	const [loading, setLoading] = useState(true);
	const [onboardingUrl, setOnboardingUrl] = useState<string | null>(null);
	const [stripeAccountId, setStripeAccountId] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isPolling, setIsPolling] = useState(false);
	const [hasNavigated, setHasNavigated] = useState(false);
	const [refreshStarted, setRefreshStarted] = useState(false);
	const [browserOpened, setBrowserOpened] = useState(false);
	const [showActions, setShowActions] = useState(false);
	const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const stripeOnboardingService = StripeOnboardingService.getInstance();

	useEffect(() => {
		initializeStripeOnboarding();
		return () => {
			if (pollIntervalRef.current) {
				clearInterval(pollIntervalRef.current);
			}
		};
	}, []);

	useEffect(() => {
		if (isPolling && stripeAccountId && !hasNavigated) {
			pollIntervalRef.current = setInterval(async () => {
				try {
					const status = await stripeOnboardingService.getOnboardingStatus(stripeAccountId);
					if (status.isOnboardingComplete && status.payoutsEnabled) {
						await handleOnboardingComplete();
					}
				} catch (error) {
					console.log('Polling error (continuing):', error);
				}
			}, 3000);
		}
		return () => {
			if (pollIntervalRef.current) {
				clearInterval(pollIntervalRef.current);
				pollIntervalRef.current = null;
			}
		};
	}, [isPolling, stripeAccountId, hasNavigated]);

	useEffect(() => {
		if (onboardingUrl && !browserOpened && !hasNavigated) {
			openInBrowser(onboardingUrl);
		}
	}, [onboardingUrl, browserOpened, hasNavigated]);

	const initializeStripeOnboarding = async () => {
		try {
			setLoading(true);
			setShowActions(false);
			if (!userData?.email) throw new Error('User email not found');
			const result = await stripeOnboardingService.createExpressAccount(
				userData.id!,
				userData.email,
				userData.firstName!,
				userData.lastName!,
				userData.dob!,
				userData.address.street,
				userData.phone,
				userData.address.city,
				userData.address.province,
				userData.address.country,
				userData.address.postalCode
			);
			setStripeAccountId(result.accountId);
			setOnboardingUrl(result.onboardingUrl);
		} catch (error: any) {
			console.error('Error initializing Stripe onboarding:', error);
			setError(error.message || 'Failed to initialize Stripe onboarding');
		} finally {
			setLoading(false);
		}
	};

	const handleOnboardingComplete = async () => {
		if (hasNavigated) return;
		setHasNavigated(true);
		setIsPolling(false);
		if (pollIntervalRef.current) {
			clearInterval(pollIntervalRef.current);
			pollIntervalRef.current = null;
		}
		setTimeout(() => {
			router.replace({ pathname: '/(profile)/payouts/stripe-success', params: { accountId: stripeAccountId || '' } });
		}, 300);
	};

	const handleReturnUrl = async (url: string) => {
		setIsPolling(false);
		if (url.includes('stripe-onboarding-complete') && !hasNavigated) {
			try {
				if (stripeAccountId) {
					const status = await stripeOnboardingService.getOnboardingStatus(stripeAccountId);
					if (status.isOnboardingComplete && status.payoutsEnabled) {
						await handleOnboardingComplete();
					} else if (status.isOnboardingComplete && !status.payoutsEnabled && !refreshStarted) {
						await refreshOnboarding();
						setRefreshStarted(true);
					}
				}
			} catch (error: any) {
				console.error('Error checking onboarding status:', error);
				Alert.alert('Error', 'Failed to verify onboarding status. Please try again.', [{ text: 'OK' }]);
			}
		}
		if (url.includes('stripe-onboarding-refresh')) {
			refreshOnboarding();
		}
	};

	const openInBrowser = async (url: string) => {
		try {
			setBrowserOpened(true);
			setIsPolling(true);
			const redirectUri = makeRedirectUri({ scheme: 'amicare' });
			const result = await WebBrowser.openAuthSessionAsync(url, redirectUri, {
				preferEphemeralSession: true,
				showInRecents: true,
			});
			if (result.type === 'success' && result.url) {
				await handleReturnUrl(result.url);
			} else if (result.type === 'cancel') {
				setIsPolling(false);
				setShowActions(true);
			}
		} catch (e) {
			console.error('Error opening Stripe onboarding:', e);
			setError('Failed to open onboarding');
			setIsPolling(false);
			setShowActions(true);
		}
	};

	const refreshOnboarding = async () => {
		try {
			if (stripeAccountId) {
				const result = await stripeOnboardingService.refreshOnboardingUrl(stripeAccountId);
				setOnboardingUrl(result.onboardingUrl);
				setBrowserOpened(false);
			}
		} catch (error: any) {
			console.error('Error refreshing onboarding URL:', error);
			setError(error.message || 'Failed to refresh onboarding');
		}
	};

	const handleSkipForNow = () => {
		if (hasNavigated) return;
		setIsPolling(false);
		if (pollIntervalRef.current) {
			clearInterval(pollIntervalRef.current);
			pollIntervalRef.current = null;
		}
		setHasNavigated(true);
		setTimeout(() => {
			router.replace('/(dashboard)/(psw)/psw-profile');
		}, 100);
	};

	if (loading && !onboardingUrl) {
		return (
			<SafeAreaView className="flex-1 bg-white justify-center items-center">
				<ActivityIndicator size="large" color="#008DF4" />
				<Text className="mt-4 text-gray-600">Setting up your payment account...</Text>
				<StatusBar backgroundColor="#FFFFFF" style="dark" />
			</SafeAreaView>
		);
	}

	if (error) {
		return (
			<SafeAreaView className="flex-1 bg-white justify-center items-center px-6">
				<Text className="text-xl font-bold mb-4">Setup Error</Text>
				<Text className="text-gray-600 text-center mb-6">{error}</Text>
				<CustomButton
					title="Try Again"
					handlePress={initializeStripeOnboarding}
					containerStyles="bg-blue-500 py-3 px-8 rounded-lg mb-4"
					textStyles="text-white font-semibold"
				/>
				<StatusBar backgroundColor="#FFFFFF" style="dark" />
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView className="flex-1 bg-white">
			<View className="flex-1 justify-center items-center px-6">
				{onboardingUrl ? (
					<>
						{loading ? (
							<ActivityIndicator size="large" color="#008DF4" />
						) : (
							<Text className="text-gray-600 text-center">Opening secure browser for Stripe onboarding...</Text>
						)}
					</>
				) : null}

				{showActions ? (
					<View className="w-full max-w-xs mt-8 space-y-3">
						<CustomButton
							title="Try Again"
							handlePress={() => onboardingUrl && openInBrowser(onboardingUrl)}
							containerStyles="bg-blue-500 py-3 rounded-lg"
							textStyles="text-white font-semibold"
						/>
						<CustomButton
							title="Skip for Now"
							handlePress={handleSkipForNow}
							containerStyles="bg-gray-200 py-3 rounded-lg"
							textStyles="text-gray-800 font-semibold"
						/>
					</View>
				) : (
					<View className="w-full max-w-xs mt-6">
						<CustomButton
							title="Skip for Now"
							handlePress={handleSkipForNow}
							containerStyles="bg-gray-200 py-3 rounded-lg"
							textStyles="text-gray-800 font-semibold"
						/>
					</View>
				)}
			</View>

			<StatusBar backgroundColor="#FFFFFF" style="dark" />
		</SafeAreaView>
	);
};

export default StripeOnboardingPayouts; 