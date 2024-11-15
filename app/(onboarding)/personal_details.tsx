import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, KeyboardAvoidingView, TouchableOpacity, Image } from 'react-native';
import ForumField from '@/components/ForumField';
import CustomButton from '@/components/CustomButton';
import { StatusBar } from "expo-status-bar";
import { useAuthState } from 'react-firebase-hooks/auth';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebase.config';
import { doc, setDoc } from 'firebase/firestore';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { uploadProfilePhoto } from '@/services/firebase/storage';

const PersonalDetails: React.FC = () => {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        age: '',
        address: '',
        phone: '',
        email: '',
        profilePhotoUrl: '',
    });

    const handleInputChange = (field: string, value: string) => {
        setForm({ ...form, [field]: value });
    };

    const [user] = useAuthState(FIREBASE_AUTH);

    useEffect(() => {
        if (user) {
            setForm((prevForm) => ({
                ...prevForm,
                email: user.email || '',
                phone: user.phoneNumber || '',
            }));
        }
    }, [user]);

    const handlePhotoUpload = async () => {
        if (user) {
            const downloadURL = await uploadProfilePhoto(user.uid);
            if (downloadURL) {
                setForm((prevForm) => ({ ...prevForm, profilePhotoUrl: downloadURL }));
            }
        }
    };

    const handleContinue = async () => {
        if (user) {
            try {
                await setDoc(doc(FIREBASE_DB, "/personal", user.uid), form, { merge: true });
                console.log("Document written with ID: ", form.email);
            } catch (e) {
                console.error("Error adding document: ", e);
            }
            router.push("/seeker_details")
        }
    };

    return (
        <SafeAreaView className="h-full bg-white">
            <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ height: '100%' }}>
                    <View className="flex w-full h-full justify-center px-9">
                        <Text className="text-3xl text-black font-normal text-left mb-3">
                            Personal Details
                        </Text>
                        <Text className="text-xs text-gray-500 font-normal text-left mb-4">
                            Please fill out the form below with your personal details
                        </Text>
                        <TouchableOpacity onPress={handlePhotoUpload} className="self-center mb-4">
                            {form.profilePhotoUrl ? (
                                <Image source={{ uri: form.profilePhotoUrl || "https://via.placeholder.com/50" }} style={{ width: 100, height: 100, borderRadius: 50 }} />
                            ) : (
                                <View className='w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center'>
                                    {/* <Text>Tap to add photo</Text> */}
                                </View>
                            )}
                        </TouchableOpacity>
                        <ForumField
                            title="First Name"
                            value={form.firstName}
                            handleChangeText={(e) => handleInputChange('firstName', e)}
                            otherStyles="mb-4"
                        />
                        <ForumField
                            title="Last Name"
                            value={form.lastName}
                            handleChangeText={(e) => handleInputChange('lastName', e)}
                            otherStyles="mb-4"
                        />
                        <ForumField
                            title="Age"
                            value={form.age}
                            handleChangeText={(e) => handleInputChange('age', e)}
                            otherStyles="mb-4"
                            keyboardType="numeric"
                        />
                        <ForumField
                            title="Address"
                            value={form.address}
                            handleChangeText={(e) => handleInputChange('address', e)}
                            otherStyles="mb-4"
                        />
                        <ForumField
                            title="Phone"
                            value={form.phone}
                            handleChangeText={(e) => handleInputChange('phone', e)}
                            otherStyles="mb-4"
                            keyboardType="phone-pad"
                        />
                        <ForumField
                            title="Email"
                            value={form.email}
                            handleChangeText={(e) => handleInputChange('email', e)}
                            otherStyles="mb-4"
                            keyboardType="email-address"
                        />
                        <CustomButton
                            title="Continue"
                            handlePress={handleContinue}
                            containerStyles="mb-6"
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            <StatusBar backgroundColor="#FFFFFF" style="dark" />
        </SafeAreaView>
    );
};

export default PersonalDetails;
