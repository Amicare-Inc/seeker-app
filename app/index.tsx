import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { CustomButton } from '@/shared/components';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { updateUserFields } from '@/redux/userSlice';

export default function Index() {
    const dispatch = useDispatch<AppDispatch>();
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);

    const [showTermsPopup, setShowTermsPopup] = useState(false);

    const handleRoleSelection = async (isPsw: boolean) => {
        if (!isTermsAccepted) {
            setShowTermsPopup(true);
            return;
        }
        dispatch(updateUserFields({ isPsw }));
        router.push('/(onboarding)/verification_prompt');
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#F2F2F7' }}>
            <StatusBar hidden />

            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '55%',
                    }}
                >
                    <Image
                        source={require('@/assets/role.png')}
                        style={{
                            width: '100%',
                            height: '100%',
                            resizeMode: 'cover',
                        }}
                    />
                    <LinearGradient
                        colors={['rgba(242,242,247,0)', 'rgba(242,242,247,1)']}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '50%',
                        }}
                    />
                </View>

                <View
                    style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        padding: 16,
                        paddingBottom: '12.5%',
                    }}
                >
                    <Text
                        style={{
                            fontSize: 38,
                            fontWeight: '400',
                            textAlign: 'center',
                            marginBottom: 30,
                        }}
                    >
                        Get Started:{'\n'}Define Your Role
                    </Text>
                    <CustomButton
                        title="I am a Care Seeker"
                        handlePress={() => handleRoleSelection(false)}
                        containerStyles="w-full mb-4"
                        textStyles="font-medium"
                    />
                    <CustomButton
                        title="I am a Care Giver"
                        handlePress={() => handleRoleSelection(true)}
                        containerStyles="w-full bg-white border border-1 border-gray-200 mb-[30px]"
                        textStyles="font-medium text-black"
                    />
                    <TouchableOpacity 
                        className="flex-row items-start px-2 mb-[40px]"
                        onPress={() => setIsTermsAccepted(!isTermsAccepted)}
                    >
                        <View className={`w-5 h-5 mr-3 mt-0.5 rounded-md bg-white border items-center justify-center ${
                            isTermsAccepted ? 'bg-brand-blue border-brand-blue' : 'border-black'
                        }`}>
                            {isTermsAccepted && (
                                <Ionicons name="checkmark" size={14} color="white" />
                            )}
                        </View>
                        <Text className="text-sm text-black flex-1 leading-5 font-medium">
                            By continuing, you agree with Amicare's{' '}
                            <Text className="text-brand-blue">Terms of use</Text> and{' '}
                            <Text className="text-brand-blue">Privacy Policy</Text>
                        </Text>
                    </TouchableOpacity>
                    <Text className="text-center">
                        Already have an account?{' '}
                        <Text
                            style={{ 
                                textDecorationLine: 'underline',
                                color: 'black',
                                fontWeight: '600'
                            }}
                            onPress={() => router.push('/sign-in')}
                            suppressHighlighting={true}
                        >
                            Log In!
                        </Text>
                    </Text>
                        {/* <View className="absolute bottom-10 bg-[#FFC8C5] p-2 flex-row items-center justify-center">
                        <Ionicons name="alert-circle" size={20} color="#FF766E" />
                        <View>

                        
                        <Text className="text-sm text-grey-80 font-medium">
                            Consent Required
                        </Text>
                        <Text className="text-sm text-grey-80 font-medium">
                            You must agree to the Terms and Privacy Policy to continue.
                        </Text>
                        </View>
                    </View> */}
                </View>
            </ScrollView>
        </View>
    );
}
