import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StatusBar, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { CustomButton } from '@/shared/components';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { updateUserFields } from '@/redux/userSlice';
import { PrivacyPolicyLink, PrivacyPolicyModal } from '@/features/privacy';
import { TermsOfUseLink, TermsOfUseModal } from '@/features/privacy/components/TermsOfUseModal';

const { height: screenHeight } = Dimensions.get('window');

export default function Index() {
    return (
        <View style={{ flex: 1, backgroundColor: '#F2F2F7' }}>
            <StatusBar hidden />
            
            {/* Back Button */}
            <View style={{ position: 'absolute', top: 50, left: 16, zIndex: 10 }}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                {/* Image Section */}
                <View style={{ height: screenHeight * 0.55, position: 'relative' }}>
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
                
                {/* Content Section */}
                <View style={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 140 }}>
                    <Text className="text-[24px] font-semibold text-grey-80 mb-1">Staying Safe & Supported</Text>
                    <Text className="text-[24px] text-grey-80 mb-6">Transparency is our top priority</Text>
                    <Text className="text-base text-grey-80 leading-6 pr-4">
                        ID Verification is required from all users. Caregivers are responsible for their own insurance and credentials. We use a secure Payment and Review system.
                    </Text>
                </View>
            </ScrollView>

            {/* Fixed Bottom Section */}
            <View style={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                right: 0, 
                backgroundColor: '#F2F2F7',
                paddingTop: 16,
                paddingBottom: 16
            }}>
                {/* Navigation Section */}
                <View style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    justifyContent: 'flex-end',
                    paddingHorizontal: 16,
                    marginBottom: 16
                }}>
                    <Text className="text-grey-80 font-light text-[20px] mr-2">Next</Text>
                    <TouchableOpacity onPress={() => router.push('/(onboarding)/role_selection')}>
                        <Ionicons name="arrow-forward-circle" size={52} color="#0C7AE2" />
                    </TouchableOpacity>
                </View>
                
                {/* Disclaimer Section */}
                <View style={{ 
                    flexDirection: 'row', 
                    paddingHorizontal: 16,
                    alignItems: 'flex-start',
                    paddingBottom: 8
                }}>
                    <Ionicons name="information-circle" size={30} color="#BFBFC3" style={{ marginTop: 2, marginRight: 8 }}/>
                    <Text className="font-medium text-[11px] text-grey-49 flex-1 leading-4">
                        By continuing, you agree that Amicare does not guarantee clients or income. You operate independently and manage your own schedule.
                    </Text>
                </View>
            </View>
        </View>
    );
}