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
                <Text className="mt-[450px] left-4 text-[24px] font-semibold text-grey-80">Welcome to Amicare</Text>
                <Text className=" left-4 text-[24px] text-grey-80">Your Trusted Care Marketplace</Text>
                <Text className=" left-4 text-base mt-[26px] text-grey-80 mr-10">Amicare helps families find compatible caregivers for in-home support. Whether you need companionship, help around the house, or daily living support - you’re in the right place. </Text>
                <View className="flex-row items-center px-5 gap-2 justify-end absolute bottom-[125px] right-0">
                    <Text className="text-grey-80 font-light text-[20px]">Next</Text>
                    <TouchableOpacity onPress={() => router.push('/(onboarding)/info_2')}>
                        <Ionicons name="arrow-forward-circle" size={52} color="#0C7AE2" />
                    </TouchableOpacity>
                </View>
                <View className="flex-row gap-2 left-4 bottom-10 absolute">
                    <Ionicons name="information-circle" size={30} color="#BFBFC3"/>
                    <Text className="font-medium text-[11px] text-grey-49 mr-[60px]">By continuing, you agree that Amicare is not a healthcare provider. We are a neutral platform connecting families to independent caregivers.</Text>
                </View>
            </View>
        </View>
    );
}
