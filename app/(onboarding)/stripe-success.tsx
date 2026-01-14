import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { AuthApi } from '@/features/auth/api/authApi';
import { CustomButton } from '@/shared/components';
import { Ionicons } from '@expo/vector-icons';

const StripeSuccess: React.FC = () => {
    const userData = useSelector((state: RootState) => state.user.userData);
    const { accountId } = useLocalSearchParams<{ accountId: string }>();
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        handleStripeAccountSave();
    }, []);

    const handleStripeAccountSave = async () => {
        try {
            setLoading(true);
            
            if (!userData?.id || !accountId) {
                throw new Error('Missing user ID or account ID');
            }

            // Save Stripe account ID to Firebase
            await AuthApi.updateStripeAccount(userData.id, accountId, userData?.isPsw || false);
            console.log('Stripe account ID saved to Firebase successfully');
            
            setSuccess(true);
        } catch (error: any) {
            console.error('Failed to save Stripe account ID:', error);
            setError(error.message || 'Failed to save Stripe account information');
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    const handleContinue = () => {
        router.push('/profile_details');
    };

    const handleTryAgain = () => {
        router.back(); // Go back to Stripe onboarding
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-white justify-center items-center">
                <ActivityIndicator size="large" color="#008DF4" />
                <Text className="mt-4 text-gray-600">Finalizing your payment setup...</Text>
                <StatusBar backgroundColor="#FFFFFF" style="dark" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 justify-center items-center px-6">
                {success ? (
                    <>
                        {/* Success State */}
                        <View className="items-center mb-8">
                            <View className="w-24 h-24 bg-green-100 rounded-full justify-center items-center mb-6">
                                <Ionicons name="checkmark" size={48} color="#10B981" />
                            </View>
                            <Text className="text-2xl font-bold text-gray-900 mb-3 text-center">
                                Payment Setup Complete!
                            </Text>
                            <Text className="text-gray-600 text-center text-base leading-6">
                                Your Stripe account has been successfully configured. You're now ready to receive payments for your services.
                            </Text>
                        </View>
                        
                        <CustomButton
                            title="Continue"
                            handlePress={handleContinue}
                            containerStyles="bg-green-500 py-4 px-12 rounded-lg w-full max-w-xs"
                            textStyles="text-white font-semibold text-lg"
                        />
                    </>
                ) : (
                    <>
                        {/* Error State */}
                        <View className="items-center mb-8">
                            <View className="w-24 h-24 bg-red-100 rounded-full justify-center items-center mb-6">
                                <Ionicons name="close" size={48} color="#EF4444" />
                            </View>
                            <Text className="text-2xl font-bold text-gray-900 mb-3 text-center">
                                Setup Failed
                            </Text>
                            <Text className="text-gray-600 text-center text-base leading-6 mb-4">
                                There was an issue saving your payment information. Please try again.
                            </Text>
                            {error && (
                                <Text className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
                                    {error}
                                </Text>
                            )}
                        </View>
                        
                        <View className="w-full max-w-xs space-y-3">
                            <CustomButton
                                title="Try Again"
                                handlePress={handleTryAgain}
                                containerStyles="bg-red-500 py-4 px-12 rounded-lg w-full"
                                textStyles="text-white font-semibold text-lg"
                            />
                            <CustomButton
                                title="Skip for Now"
                                handlePress={handleContinue}
                                containerStyles="bg-gray-300 py-4 px-12 rounded-lg w-full"
                                textStyles="text-gray-700 font-semibold text-lg"
                            />
                        </View>
                    </>
                )}
            </View>
            <StatusBar backgroundColor="#FFFFFF" style="dark" />
        </SafeAreaView>
    );
};

export default StripeSuccess; 