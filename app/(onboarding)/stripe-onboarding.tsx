import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { updateUserFields } from '@/redux/userSlice';
import { StripeOnboardingService } from '@/services/stripe/onboarding-service';
import CustomButton from '@/components/Global/CustomButton';

const StripeOnboarding: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const userData = useSelector((state: RootState) => state.user.userData);
    const [loading, setLoading] = useState(true);
    const [onboardingUrl, setOnboardingUrl] = useState<string | null>(null);
    const [stripeAccountId, setStripeAccountId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [onboardingComplete, setOnboardingComplete] = useState(false);
    const [isPolling, setIsPolling] = useState(false);

    const stripeOnboardingService = StripeOnboardingService.getInstance();

    useEffect(() => {
        initializeStripeOnboarding();
    }, []);

    // Poll for onboarding completion every 3 seconds when WebView is active
    useEffect(() => {
        let pollInterval: ReturnType<typeof setInterval>;
        
        if (isPolling && stripeAccountId && !onboardingComplete) {
            pollInterval = setInterval(async () => {
                try {
                    const status = await stripeOnboardingService.getOnboardingStatus(stripeAccountId);
                    
                    if (status.isOnboardingComplete && status.chargesEnabled) {
                        setIsPolling(false);
                        setOnboardingComplete(true);
                        Alert.alert(
                            'Success!',
                            'Your Stripe account has been set up successfully.',
                            [
                                {
                                    text: 'Continue',
                                    onPress: () => router.push('/onboard1')
                                }
                            ]
                        );
                    }
                } catch (error) {
                    console.log('Polling error (will retry):', error);
                }
            }, 3000); // Poll every 3 seconds
        }

        return () => {
            if (pollInterval) {
                clearInterval(pollInterval);
            }
        };
    }, [isPolling, stripeAccountId, onboardingComplete]);

    const initializeStripeOnboarding = async () => {
        try {
            setLoading(true);
            
            if (!userData?.email) {
                throw new Error('User email not found');
            }

            // Create Express account and get onboarding URL
            const result = await stripeOnboardingService.createExpressAccount(
                userData.id,
                userData.email,
                userData.firstName,
                userData.lastName,
                userData.dob!,
                userData.address,
                userData.phone
            );

            setStripeAccountId(result.accountId);
            setOnboardingUrl(result.onboardingUrl);
            
            // Save stripe account ID to user data
            dispatch(updateUserFields({ stripeAccountId: result.accountId }));
            
        } catch (error: any) {
            console.error('Error initializing Stripe onboarding:', error);
            setError(error.message || 'Failed to initialize Stripe onboarding');
        } finally {
            setLoading(false);
        }
    };

    const handleWebViewNavigationStateChange = async (navState: any) => {
        const url = navState.url;
        
        // Start polling when user navigates to Stripe onboarding
        if (url.includes('connect.stripe.com') && !isPolling) {
            setIsPolling(true);
        }
        
        // Check if user completed onboarding (fallback detection)
        if (url.includes('stripe-onboarding-complete')) {
            try {
                if (stripeAccountId) {
                    const status = await stripeOnboardingService.getOnboardingStatus(stripeAccountId);
                    
                    if (status.isOnboardingComplete && status.chargesEnabled) {
                        setIsPolling(false);
                        setOnboardingComplete(true);
                        Alert.alert(
                            'Success!',
                            'Your Stripe account has been set up successfully.',
                            [
                                {
                                    text: 'Continue',
                                    onPress: () => router.push('/onboard1')
                                }
                            ]
                        );
                    } else {
                        Alert.alert(
                            'Onboarding Incomplete',
                            'Please complete all required fields in the Stripe onboarding process.',
                            [
                                {
                                    text: 'Continue Setup',
                                    onPress: () => {
                                        // Refresh onboarding URL and reload
                                        refreshOnboarding();
                                    }
                                }
                            ]
                        );
                    }
                }
            } catch (error: any) {
                console.error('Error checking onboarding status:', error);
                Alert.alert(
                    'Error',
                    'Failed to verify onboarding status. Please try again.',
                    [{ text: 'OK' }]
                );
            }
        }
        
        // Handle refresh
        if (url.includes('stripe-onboarding-refresh')) {
            refreshOnboarding();
        }
    };

    const refreshOnboarding = async () => {
        try {
            if (stripeAccountId) {
                const result = await stripeOnboardingService.refreshOnboardingUrl(stripeAccountId);
                setOnboardingUrl(result.onboardingUrl);
            }
        } catch (error: any) {
            console.error('Error refreshing onboarding URL:', error);
            setError(error.message || 'Failed to refresh onboarding');
        }
    };

    const handleSkipForNow = () => {
        setIsPolling(false);
        Alert.alert(
            'Skip Stripe Setup?',
            'You can set up payments later in your profile settings, but you won\'t be able to receive payments until this is completed.',
            [
                {
                    text: 'Set Up Now',
                    style: 'default'
                },
                {
                    text: 'Skip for Now',
                    style: 'destructive',
                    onPress: () => router.push('/onboard1')
                }
            ]
        );
    };

    const handleManualCheck = async () => {
        if (stripeAccountId) {
            try {
                setLoading(true);
                const status = await stripeOnboardingService.getOnboardingStatus(stripeAccountId);
                
                if (status.isOnboardingComplete && status.chargesEnabled) {
                    setOnboardingComplete(true);
                    Alert.alert(
                        'Success!',
                        'Your Stripe account has been set up successfully.',
                        [
                            {
                                text: 'Continue',
                                onPress: () => router.push('/onboard1')
                            }
                        ]
                    );
                } else {
                    Alert.alert(
                        'Not Complete Yet',
                        'Please complete all required fields in the Stripe onboarding process above.',
                        [{ text: 'OK' }]
                    );
                }
            } catch (error: any) {
                Alert.alert(
                    'Error',
                    'Failed to check onboarding status. Please try again.',
                    [{ text: 'OK' }]
                );
            } finally {
                setLoading(false);
            }
        }
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
                <CustomButton
                    title="Skip for Now"
                    handlePress={handleSkipForNow}
                    containerStyles="bg-gray-300 py-3 px-8 rounded-lg"
                    textStyles="text-gray-700 font-semibold"
                />
                <StatusBar backgroundColor="#FFFFFF" style="dark" />
            </SafeAreaView>
        );
    }

    if (onboardingComplete) {
        return (
            <SafeAreaView className="flex-1 bg-white justify-center items-center px-6">
                <Text className="text-2xl font-bold mb-4 text-green-600">Success!</Text>
                <Text className="text-gray-600 text-center mb-6">
                    Your Stripe account has been set up successfully. You can now receive payments from clients.
                </Text>
                <CustomButton
                    title="Continue"
                    handlePress={() => router.push('/onboard1')}
                    containerStyles="bg-green-500 py-3 px-8 rounded-lg"
                    textStyles="text-white font-semibold"
                />
                <StatusBar backgroundColor="#FFFFFF" style="dark" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1">
                {onboardingUrl && (
                    <WebView
                        source={{ uri: onboardingUrl }}
                        onNavigationStateChange={handleWebViewNavigationStateChange}
                        startInLoadingState={true}
                        renderLoading={() => (
                            <View className="flex-1 justify-center items-center">
                                <ActivityIndicator size="large" color="#008DF4" />
                            </View>
                        )}
                    />
                )}
            </View>
            
            <StatusBar backgroundColor="#FFFFFF" style="dark" />
        </SafeAreaView>
    );
};

export default StripeOnboarding; 