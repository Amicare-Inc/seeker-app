import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { CustomButton } from '@/shared/components';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { updateUserFields } from '@/redux/userSlice';
import { PrivacyPolicyLink, PrivacyPolicyModal } from '@/features/privacy';
import { TermsOfUseLink, TermsOfUseModal } from '@/features/privacy/components/TermsOfUseModal';

export default function Index() {
    const dispatch = useDispatch<AppDispatch>();
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);

    const handleRoleSelection = async (isPsw: boolean) => {
        if (!isTermsAccepted) {
            setShowErrorMessage(true);
            return;
        } else {
            console.log('GOING TO SIGN UP', isPsw);
            await dispatch(updateUserFields({ isPsw }));
            router.push('/sign-up-method');
        }
    };

    const handleTermsToggle = () => {
        setIsTermsAccepted(!isTermsAccepted);
        // Hide error message when terms are accepted
        if (!isTermsAccepted) {
            setShowErrorMessage(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#F2F2F7' }}>
            <StatusBar hidden />
            <View style={{ flex: 1 }}>
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
                        source={require('@/assets/role_reduced.png')}
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
                    {showErrorMessage && (
                        <View className="w-full mb-2">
                            <Text className="text-red-500 text-xs text-center font-medium">
                                Please confirm you agree by checking the box below.
                            </Text>
                        </View>
                    )}
                    <TouchableOpacity 
                        className="flex-row mb-[30px] w-full items-start"
                        onPress={handleTermsToggle}
                    >
                        <View
                            className={`w-5 h-5 mr-3 mt-1 rounded-md bg-white border items-center justify-center flex-shrink-0 ${
                                isTermsAccepted ? 'bg-brand-blue border-brand-blue' : 'border-black'
                            }`}
                        >
                            {isTermsAccepted && (
                                <Ionicons name="checkmark" size={14} color="white" />
                            )}
                        </View>

                        <View className="flex-1">
                            <Text className="text-[11px] text-grey-58 font-medium">
                                By continuing, you confirm that you've read and agree to Amicare's{' '}
                            <TermsOfUseLink
                                textStyle={{ fontSize: 11, fontWeight: '500' }}
                                onPress={() => setShowTermsModal(true)}
                            />
                            {' and '}
                            <PrivacyPolicyLink 
                                textStyle={{ fontSize: 11, fontWeight: '500' }} 
                                onPress={() => setShowPrivacyModal(true)}
                            />, and understand that Amicare is a neutral platform - not a healthcare provider. All caregivers are independant professionals.
                            </Text>
                        </View>
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
                </View>
            </View>
            
            <TermsOfUseModal
                visible={showTermsModal}
                onClose={() => setShowTermsModal(false)}
            />
            <PrivacyPolicyModal 
                visible={showPrivacyModal} 
                onClose={() => setShowPrivacyModal(false)} 
            />
        </View>
    );
}
