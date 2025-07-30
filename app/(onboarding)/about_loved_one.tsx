import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { CustomButton } from '@/shared/components';
import { StatusBar } from 'expo-status-bar';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { updateUserFields, setTempFamilyMember } from '@/redux/userSlice';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { DatePickerField } from '@/shared/components';
import { RegionValidatedAddressInput } from '@/shared/components';
import { type AddressComponents } from '@/services/google/googlePlacesService';

const genderOptions = ['Male', 'Female', 'Other'];

const AboutLovedOne: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const userData = useSelector((state: RootState) => state.user.userData);
    const tempFamilyMember = useSelector((state: RootState) => state.user.tempFamilyMember);
    const [showGenderDropdown, setShowGenderDropdown] = useState(false);
    const [focusedFields, setFocusedFields] = useState({
        firstName: false,
        lastName: false,
        placeOfService: false,
    });

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        placeOfService: '',
        dob: '',
        gender: '',
        hasPermission: false,
        address: {
            fullAddress: '',
            street: '',
            city: '',
            province: '',
            country: '',
            postalCode: '',
        },
    });

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        address: '',
        gender: '',
        hasPermission: '',
    });

    const [isAddressValid, setIsAddressValid] = useState(false);

    const handleInputChange = (field: string, value: string | boolean) => {
        setForm({ ...form, [field]: value });
        setErrors({ ...errors, [field]: '' });
    };

    const handleAddressSelected = (addressData: AddressComponents) => {
        setForm({
            ...form,
            placeOfService: addressData.fullAddress, // Store in original placeOfService field too
            address: {
                fullAddress: addressData.fullAddress,
                street: addressData.street,
                city: addressData.city,
                province: addressData.province,
                country: addressData.country,
                postalCode: addressData.postalCode,
            }
        });
        setErrors({ ...errors, address: '' });
    };

    const handleAddressValidation = (isValid: boolean, error?: string) => {
        setIsAddressValid(isValid);
        if (!isValid && error) {
            setErrors({ ...errors, address: error });
        }
    };

    const validateForm = async () => {
        const newErrors: any = {};
        if (!form.firstName) newErrors.firstName = 'First name is required';
        if (!form.lastName) newErrors.lastName = 'Last name is required';
        if (!form.dob) newErrors.dob = 'Date of birth is required';
        if (!form.address.fullAddress && !form.placeOfService) newErrors.address = 'Address is required';
        if (!form.gender) newErrors.gender = 'Gender is required';
        if (!form.hasPermission) newErrors.hasPermission = 'You must confirm permission to continue';

        // Address validation is now handled by the RegionValidatedAddressInput component
        if (!isAddressValid && !form.placeOfService) {
            newErrors.address = 'Please select a valid address from the suggestions';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFocus = (field: string) => {
        // Reset all focus states first, then set the current field
        setFocusedFields({
            firstName: false,
            lastName: false,
            placeOfService: false,
            [field]: true
        });
    };

    const handleBlur = (field: string) => {
        setFocusedFields({ ...focusedFields, [field]: false });
    };

    const handleContinue = async () => {
        if (await validateForm()) {
            try {
                // Store family member data temporarily in Redux tempFamilyMember field
                // IMPORTANT: Preserve existing carePreferences if they exist
                const updatedFamilyMember = {
                    ...tempFamilyMember, // Preserve existing data (including carePreferences)
                    ...form, // Add new personal details
                    step: 'personal_details'
                };
                
                console.log('🔍 ABOUT_LOVED_ONE DEBUG - Before update:', {
                    existingTempFamilyMember: tempFamilyMember,
                    formData: form,
                    updatedFamilyMember
                });
                
                dispatch(setTempFamilyMember(updatedFamilyMember));
                
                console.log('Family member personal details saved:', form);
                router.push('/loved_one_relationship');
            } catch (error) {
                console.error('Error saving family member details:', error);
            }
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-grey-0">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
                keyboardVerticalOffset={0}
            >
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
                            {errors.firstName ? (
                                <Text className="text-red-500 text-xs mt-1">
                                    {errors.firstName}
                                </Text>
                            ) : null}
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
                            {errors.lastName ? (
                                <Text className="text-red-500 text-xs mt-1">
                                    {errors.lastName}
                                </Text>
                            ) : null}
                        </View>
                    </View>



                    {/* Place of Service */}
                    <View className="mb-[15px]">
                        <Text className="text-base font-medium text-black mb-[8px]">Place of Service (Where they will receive care)</Text>
                        <RegionValidatedAddressInput
                            placeholder="e.g. 24 Willow Street, A1B 2C3"
                            initialValue={form.address.fullAddress}
                            onAddressSelected={handleAddressSelected}
                            onValidationResult={handleAddressValidation}
                            otherStyles="bg-white rounded-lg border border-gray-200"
                        />
                        {errors.address ? (
                            <Text className="text-red-500 text-xs mt-1">
                                {errors.address}
                            </Text>
                        ) : null}
                    </View>



                    {/* Date of Birth and Gender Row */}
                    <View className="flex-row mb-[26px]">
                        <View className="flex-1 mr-2">
                            <View className="flex-row items-center mb-[8px]">
                                <Text className="text-base font-medium text-black">Date of Birth</Text>
                                <Ionicons name="information-circle-outline" size={20} color="#303031" style={{ marginLeft: 4 }} />
                            </View>
                            <DatePickerField
                                title=""
                                value={form.dob}
                                onDateChange={(date) => handleInputChange('dob', date)}
                                otherStyles="bg-white border border-gray-200 rounded-lg"
                            />
                            {errors.dob ? (
                                <Text className="text-red-500 text-xs mt-1">
                                    {errors.dob}
                                </Text>
                            ) : null}
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
                            {errors.gender ? (
                                <Text className="text-red-500 text-xs mt-1">
                                    {errors.gender}
                                </Text>
                            ) : null}
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
                    {errors.hasPermission ? (
                        <Text className="text-red-500 text-xs mb-4 -mt-4">
                            {errors.hasPermission}
                        </Text>
                    ) : null}
                </View>
            </ScrollView>
            </KeyboardAvoidingView>

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
