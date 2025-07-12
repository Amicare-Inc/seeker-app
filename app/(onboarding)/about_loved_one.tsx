import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { CustomButton } from '@/shared/components';
import { StatusBar } from 'expo-status-bar';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { updateUserFields } from '@/redux/userSlice';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const genderOptions = ['Male', 'Female', 'Other'];

const AboutLovedOne: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const userData = useSelector((state: RootState) => state.user.userData);

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        cityLiveIn: '',
        placeOfService: '',
        aptSuiteNo: '',
        saveAddressAs: '',
        dob: '',
        gender: '',
        hasPermission: false,
    });

    const [showGenderDropdown, setShowGenderDropdown] = useState(false);
    const [focusedFields, setFocusedFields] = useState({
        firstName: false,
        lastName: false,
        cityLiveIn: false,
        placeOfService: false,
        aptSuiteNo: false,
        saveAddressAs: false,
    });

    const handleInputChange = (field: string, value: string | boolean) => {
        setForm({ ...form, [field]: value });
    };

    const handleFocus = (field: string) => {
        // Reset all focus states first, then set the current field
        setFocusedFields({
            firstName: false,
            lastName: false,
            cityLiveIn: false,
            placeOfService: false,
            aptSuiteNo: false,
            saveAddressAs: false,
            [field]: true
        });
    };

    const handleBlur = (field: string) => {
        setFocusedFields({ ...focusedFields, [field]: false });
    };

    const handleContinue = async () => {
        // For now, just navigate to next page
        router.push('/loved_one_relationship');
    };

    return (
        <SafeAreaView className="flex-1 bg-grey-0">
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <View className="px-[16px]">
                    {/* Header */}
                    <View className="flex-row items-center mb-[17px]">
                        <TouchableOpacity className="absolute" onPress={() => router.back()}>
                            <Ionicons name="chevron-back" size={24} color="#000" />
                        </TouchableOpacity>
                        <Text className="text-lg font-bold mx-auto">
                            Tell us about your loved one...
                        </Text>
                    </View>

                    {/* Subtitle */}
                    <Text className="text-sm text-grey-80 mb-[21px] leading-5 text-center mx-auto">
                        We use this information to match your loved{"\n"}one with the right caregiver. This info is stored{"\n"}securely and only shared with your consent.
                    </Text>

                    {/* First Name and Last Name Row */}
                    <View className="flex-row mb-[15px]">
                        <View className="flex-1 mr-2">
                            <Text className="text-base font-medium text-black mb-[8px]">First Name</Text>
                            <TextInput
                                className={`bg-white rounded-lg px-3 py-2.5 text-lg text-black font-medium ${
                                    focusedFields.firstName ? 'border-2 border-brand-blue' : 'border border-gray-200'
                                }`}
                                placeholder="First Name"
                                placeholderTextColor="#9D9DA1"
                                value={form.firstName}
                                onChangeText={(value) => handleInputChange('firstName', value)}
                                onFocus={() => handleFocus('firstName')}
                                onBlur={() => handleBlur('firstName')}
                            />
                        </View>
                        <View className="flex-1 ml-2">
                            <Text className="text-base font-medium text-black mb-[8px]">Last Name</Text>
                            <TextInput
                                className={`bg-white rounded-lg px-3 py-2.5 text-lg text-black font-medium ${
                                    focusedFields.lastName ? 'border-2 border-brand-blue' : 'border border-gray-200'
                                }`}
                                placeholder="Last Name"
                                placeholderTextColor="#9D9DA1"
                                value={form.lastName}
                                onChangeText={(value) => handleInputChange('lastName', value)}
                                onFocus={() => handleFocus('lastName')}
                                onBlur={() => handleBlur('lastName')}
                            />
                        </View>
                    </View>

                    {/* City they live in */}
                    <View className="mb-[15px]">
                        <Text className="text-base font-medium text-black mb[8px]2">City they live in</Text>
                        <TextInput
                            className={`bg-white rounded-lg px-3 py-2.5 text-lg text-black font-medium ${
                                focusedFields.cityLiveIn ? 'border-2 border-brand-blue' : 'border border-gray-200'
                            }`}
                            placeholder="e.g Toronto, ON"
                            placeholderTextColor="#9D9DA1"
                            value={form.cityLiveIn}
                            onChangeText={(value) => handleInputChange('cityLiveIn', value)}
                            onFocus={() => handleFocus('cityLiveIn')}
                            onBlur={() => handleBlur('cityLiveIn')}
                        />
                    </View>

                    {/* Place of Service */}
                    <View className="mb-[15px]">
                        <Text className="text-base font-medium text-black mb-[8px]">Place of Service (Where they will receive care)</Text>
                        <TextInput
                            className={`bg-white rounded-lg px-3 py-2.5 text-lg text-black font-medium ${
                                focusedFields.placeOfService ? 'border-2 border-brand-blue' : 'border border-gray-200'
                            }`}
                            placeholder="e.g 24 Willow Street, A1B 2C3"
                            placeholderTextColor="#9D9DA1"
                            value={form.placeOfService}
                            onChangeText={(value) => handleInputChange('placeOfService', value)}
                            onFocus={() => handleFocus('placeOfService')}
                            onBlur={() => handleBlur('placeOfService')}
                        />
                    </View>

                    {/* Apt/Suite No and Save Address Row */}
                    <View className="flex-row mb-[15px]">
                        <View className="flex-1 mr-2">
                            <Text className="text-base font-medium text-black mb-[8px]">Apt/Suite No</Text>
                            <TextInput
                                className={`bg-white rounded-lg px-4 py-2.5 text-lg text-black font-medium ${
                                    focusedFields.aptSuiteNo ? 'border-2 border-brand-blue' : 'border border-gray-200'
                                }`}
                                placeholder="..."
                                placeholderTextColor="#9D9DA1"
                                value={form.aptSuiteNo}
                                onChangeText={(value) => handleInputChange('aptSuiteNo', value)}
                                onFocus={() => handleFocus('aptSuiteNo')}
                                onBlur={() => handleBlur('aptSuiteNo')}
                            />
                        </View>
                        <View className="flex-1 ml-2">
                            <Text className="text-base font-medium text-black mb-[8px]">Save this address as:</Text>
                            <TextInput
                                className={`bg-white rounded-lg px-4 py-2.5 text-lg text-black font-medium ${
                                    focusedFields.saveAddressAs ? 'border-2 border-brand-blue' : 'border border-gray-200'
                                }`}
                                placeholder="..."
                                placeholderTextColor="#9D9DA1"
                                value={form.saveAddressAs}
                                onChangeText={(value) => handleInputChange('saveAddressAs', value)}
                                onFocus={() => handleFocus('saveAddressAs')}
                                onBlur={() => handleBlur('saveAddressAs')}
                            />
                        </View>
                    </View>

                    {/* Date of Birth and Gender Row */}
                    <View className="flex-row mb-[26px]">
                        <View className="flex-1 mr-2">
                            <View className="flex-row items-center mb-[8px]">
                                <Text className="text-base font-medium text-black">Date of Birth</Text>
                                <Ionicons name="information-circle-outline" size={20} color="#303031" style={{ marginLeft: 4 }} />
                            </View>
                            <TouchableOpacity className="bg-white rounded-lg px-4 py-2.5 flex-row justify-between items-center border border-gray-200">
                                <Text className="text-lg font-medium text-grey-35">...</Text>
                                <Ionicons name="chevron-down" size={20} color="#BFBFC3" />
                            </TouchableOpacity>
                        </View>
                        <View className="flex-1 ml-2">
                            <View className="flex-row items-center mb-[8px]">
                                <Text className="text-base font-medium text-black">Gender</Text>
                                <Ionicons name="information-circle-outline" size={20} color="#303031" style={{ marginLeft: 4 }} />
                            </View>
                            <TouchableOpacity 
                                className={`bg-white rounded-lg px-4 py-2.5 flex-row justify-between items-center ${
                                    showGenderDropdown ? 'border-2 border-brand-blue' : 'border border-gray-200'
                                }`}
                                onPress={() => setShowGenderDropdown(!showGenderDropdown)}
                            >
                                <Text className={`text-lg font-medium ${form.gender ? 'text-black' : 'text-grey-35'}`}>
                                    {form.gender || '...'}
                                </Text>
                                <Ionicons 
                                    name={showGenderDropdown ? "chevron-up" : "chevron-down"} 
                                    size={20} 
                                    color="#BFBFC3" 
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Gender Dropdown Options */}
                    {showGenderDropdown && (
                        <View className="mb-[20px] overflow-hidden">
                            {genderOptions.map((gender, index) => (
                                <TouchableOpacity
                                    key={gender}
                                    className={`bg-white px-4 py-4 flex-row justify-between items-center ${
                                        index === 0 ? 'rounded-t-lg' : ''
                                    } ${
                                        index === genderOptions.length - 1 ? 'rounded-b-lg' : ''
                                    } ${
                                        index < genderOptions.length - 1 ? 'border-b border-gray-200' : ''
                                    }`}
                                    onPress={() => {
                                        handleInputChange('gender', gender);
                                        setShowGenderDropdown(false);
                                    }}
                                >
                                    <Text className={`text-base text-black ${
                                        form.gender === gender ? 'font-bold' : 'font-normal'
                                    }`}>
                                        {gender}
                                    </Text>
                                    {form.gender === gender && (
                                        <View className="w-5 h-5 bg-brand-blue rounded-full items-center justify-center">
                                            <Ionicons name="checkmark" size={14} color="white" />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* Permission Checkbox */}
                    <TouchableOpacity 
                        className="flex-row items-start mb-[32px]"
                        onPress={() => handleInputChange('hasPermission', !form.hasPermission)}
                    >
                        <View className={`w-5 h-5 mr-3 mt-0.5 rounded border items-center justify-center ${
                            form.hasPermission ? 'bg-brand-blue border-brand-blue' : 'border-black'
                        }`}>
                            {form.hasPermission && (
                                <Ionicons name="checkmark" size={14} color="white" />
                            )}
                        </View>
                        <Text className="text-sm text-black flex-1 leading-5">
                            I confirm I have permission from the care recipient to share this information.
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Continue Button */}
            <View className="px-[16px] pb-[21px]">
                <CustomButton
                    title="Continue"
                    handlePress={handleContinue}
                    containerStyles="bg-black py-4 rounded-lg"
                    textStyles="text-white text-xl font-medium"
                />
            </View>
            <StatusBar backgroundColor="#FFFFFF" style="dark" />
        </SafeAreaView>
    );
};

export default AboutLovedOne;
