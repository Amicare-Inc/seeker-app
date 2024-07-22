import React, { useEffect, useState } from 'react';
import { View, Text, Button, SafeAreaView, ScrollView } from 'react-native';
import { getAuth, onAuthStateChanged, sendEmailVerification } from 'firebase/auth';
import { useRouter } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import { StatusBar } from 'expo-status-bar';

const VerifyEmail = () => {
    const router = useRouter();
    const auth = getAuth();
    const [user, setUser] = useState(auth.currentUser);

    useEffect(() => {
        if (user && !user.emailVerified) {
            sendEmailVerification(user)
                .then(() => {
                    console.log('Verification email sent', 'Please check your email to verify your account.');
                })
                .catch((error) => {
                    console.log('Error', error.message);
                });
        }
    }, [user]);

    useEffect(() => {
        if (user && !user.emailVerified) {
          const interval = setInterval(async () => {
            await user.reload();
            if (user.emailVerified) {
              clearInterval(interval);
              router.push('/role');
            }
          }, 3000); // Check every 3 seconds
    
          return () => clearInterval(interval); // Clear interval on component unmount
        }
      }, [user, router]);

    const handleButton = () => {
        if (user) {
            sendEmailVerification(user)
                .then(() => {
                    console.log('Verification email resent', 'Please check your email to verify your account.');
                })
                .catch((error) => {
                    console.log('Error', error.message);
                });
        }
    };


    return (
        <SafeAreaView className="h-full bg-white" >
            <ScrollView contentContainerStyle={{ height: '100%' }}>
                <View className="flex w-full h-full justify-center items-center px-4">
                    <Text className="text-5xl text-black font-thin text-center mb-11">
                        Please verify your email address
                    </Text>
                    <CustomButton 
                        title="Resend verification email" 
                        handlePress={handleButton}
                        containerStyles="mb-6 px-9" 
                    />
                </View>
            </ScrollView>
            <StatusBar backgroundColor="#FFFFFF" style="dark" />
        </SafeAreaView>
    );
};

export default VerifyEmail;
