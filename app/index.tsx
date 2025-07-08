import React from 'react';
import { View, Text, Image, ScrollView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import CustomButton from '@/components/Global/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { updateUserFields } from '@/redux/userSlice';

export default function Index() {
    const dispatch = useDispatch<AppDispatch>();

    const handleRoleSelection = async (isPsw: boolean) => {
        dispatch(updateUserFields({ isPsw }));
        router.push('/sign-up');
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
                        containerStyles="w-full bg-white border border-1 border-gray-200 mb-8"
                        textStyles="font-medium text-black"
                    />
                    <Text style={{ textAlign: 'center', marginBottom: 26 }}>
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
                    <View className="flex flex-row justify-center items-center gap-1">
                        <Ionicons name="information-circle" size={24} color="#BFBFC3" />
                        <Text style={{ textAlign: 'center', color: '#666', fontSize: 12 }}>
                            By continuing, you agree with our{' '}
                            <Text
                                style={{
                                    color: '#007AFF',
                                    textDecorationLine: 'none'
                                }}
                                onPress={() => {}}
                            >
                                Privacy Policy.
                            </Text>
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}