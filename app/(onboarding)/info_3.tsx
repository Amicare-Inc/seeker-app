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
                        source={require('@/assets/info_3.jpg')}
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
                <Text className="mt-[450px] left-4 text-[24px] font-semibold text-grey-80">Staying Safe & Supported</Text>
                <Text className=" left-4 text-[24px] text-grey-80">Transparency is our top priority</Text>
                <Text className=" left-4 text-base mt-[26px] text-grey-80 mr-10">ID Verification is required from all users. 
                Caregivers are responsible for their own insurance and credentials. 
                We use a secure Payment and Review system.</Text>
                <View className="flex-row items-center px-5 gap-2 justify-end absolute bottom-[125px] right-0">
                    <Text className="text-grey-80 font-light text-[20px]">Next</Text>
                    <TouchableOpacity onPress={() => router.push('/(onboarding)/role_selection')}>
                        <Ionicons name="arrow-forward-circle" size={52} color="#0C7AE2" />
                    </TouchableOpacity>
                </View>
                <View className="flex-row gap-2 left-4 bottom-10 absolute">
                    <Ionicons name="information-circle" size={30} color="#BFBFC3"/>
                    <Text className="font-medium text-[11px] text-grey-49 mr-20">By continuing, you agree that Amicare does not guarantee clients or income. You operate independently and manage your own schedule</Text>
                </View>
            </View>
        </View>
    );
}
