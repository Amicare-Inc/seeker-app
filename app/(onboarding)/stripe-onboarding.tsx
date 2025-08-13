import React, { useState, useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { updateUserFields } from '@/redux/userSlice';
import { StripeOnboardingService } from '@/services/stripe/onboarding-service';
import { CustomButton } from '@/shared/components';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

const StripeOnboarding: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const userData = useSelector((state: RootState) => state.user.userData);
    const [loading, setLoading] = useState(true);
    const [onboardingUrl, setOnboardingUrl] = useState<string | null>(null);
    const [stripeAccountId, setStripeAccountId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPolling, setIsPolling] = useState(false);
    const [hasNavigated, setHasNavigated] = useState(false); // Prevent multiple navigation attempts
    const [refreshStarted, setRefreshStarted] = useState(false);
    const [browserOpened, setBrowserOpened] = useState(false);
    const [showActions, setShowActions] = useState(false);
    const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const stripeOnboardingService = StripeOnboardingService.getInstance();

    useEffect(() => {
        initializeStripeOnboarding();
        
        // Cleanup on unmount
        return () => {
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
            }
        };
    }, []);

    // Poll for onboarding completion every 3 seconds while the external browser is open
    useEffect(() => {
        if (isPolling && stripeAccountId && !hasNavigated) {
            pollIntervalRef.current = setInterval(async () => {
                try {
                    const status = await stripeOnboardingService.getOnboardingStatus(stripeAccountId);
                    
                    if (status.isOnboardingComplete && status.payoutsEnabled) {
                        await handleOnboardingComplete();
                    }
                } catch (error) {
                    // Silently continue polling on error
                    console.log('Polling error (continuing):', error);
                }
            }, 3000); // Poll every 3 seconds
        }

        return () => {
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = null;
            }
        };
    }, [isPolling, stripeAccountId, hasNavigated]);

    // When we have an onboarding URL, open it in the system browser
    useEffect(() => {
        if (onboardingUrl && !browserOpened && !hasNavigated) {
            openInBrowser(onboardingUrl);
        }
    }, [onboardingUrl, browserOpened, hasNavigated]);

    const initializeStripeOnboarding = async () => {
        try {
            setLoading(true);
            setShowActions(false);
            
            if (!userData?.email) {
                throw new Error('User email not found');
            }

            // Create Express account and get onboarding URL
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
            
            // Save stripe account ID to Redux only
            dispatch(updateUserFields({ stripeAccountId: result.accountId }));
            
        } catch (error: any) {
            console.error('Error initializing Stripe onboarding:', error);
            setError(error.message || 'Failed to initialize Stripe onboarding');
        } finally {
            setLoading(false);
        }
    };

    const handleOnboardingComplete = async () => {
        if (hasNavigated) return; // Prevent multiple navigation attempts

        setHasNavigated(true);
        setIsPolling(false);

        if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
        }

        // Navigate to success page with account ID
        setTimeout(() => {
            router.push(`/stripe-success?accountId=${stripeAccountId}`);
        }, 500);
    };

    const handleReturnUrl = async (url: string) => {
        // Start/stop polling based on return
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
            // Use app deep link scheme so the auth session closes when our HTTPS return page redirects to it
            const redirectUri = makeRedirectUri({ scheme: 'amicare' });
            const result = await WebBrowser.openAuthSessionAsync(url, redirectUri, {
                preferEphemeralSession: true,
                showInRecents: true,
            });

            // When the browser returns to the app
            if (result.type === 'success' && result.url) {
                await handleReturnUrl(result.url);
            } else if (result.type === 'cancel') {
                // user dismissed; show actions to recover
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
                // re-open refreshed link
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
        
        // Continue to next onboarding step without Stripe
        setHasNavigated(true);
        setTimeout(() => {
            router.push('/profile_details');
        }, 100);
    };

    const handleManualCheck = async () => {
        if (stripeAccountId && !hasNavigated) {
            try {
                setLoading(true);
                const status = await stripeOnboardingService.getOnboardingStatus(stripeAccountId);
                
                if (status.isOnboardingComplete && status.payoutsEnabled) {
                    await handleOnboardingComplete();
                } else if (status.isOnboardingComplete && !status.payoutsEnabled && !refreshStarted) {
                    await refreshOnboarding();
                    setRefreshStarted(true);
                }
            } catch (error: any) {
                Alert.alert('Error', 'Failed to check onboarding status. Please try again.', [{ text: 'OK' }]);
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

export default StripeOnboarding; 