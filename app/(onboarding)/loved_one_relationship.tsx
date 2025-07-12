import React, { useState, useRef } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { CustomButton } from '@/shared/components';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { updateUserFields } from '@/redux/userSlice';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const relationshipOptions = [
    'Mom', 'Dad', 'Grandma', 'Grandpa',
    'Sister', 'Brother', 'Aunt', 'Uncle',
    'Mother-in-law', 'Father-in-law', 'Partner', 'Other Relative',
    'Friend', 'Client'
];

const LovedOneRelationship: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const userData = useSelector((state: RootState) => state.user.userData);
    const scrollViewRef = useRef<ScrollView>(null);

    const [selectedRelationship, setSelectedRelationship] = useState<string>('');
    const [customRelationship, setCustomRelationship] = useState<string>('');
    const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
    const [customInputFocused, setCustomInputFocused] = useState<boolean>(false);

    const handleRelationshipSelect = (relationship: string) => {
        if (relationship === 'Something Else') {
            setShowCustomInput(true);
            setSelectedRelationship('');
        } else {
            setSelectedRelationship(relationship);
            setShowCustomInput(false);
            setCustomRelationship('');
        }
    };

    const handleCustomInputBlur = () => {
        setCustomInputFocused(false);
        // Only hide custom input if there's no text, otherwise keep it visible
        if (!customRelationship.trim()) {
            setShowCustomInput(false);
        }
    };

    const handleCustomInputSubmit = () => {
        setCustomInputFocused(false);
        // Keep the input visible with the entered text
    };

    const handleNext = () => {
        const finalRelationship = showCustomInput ? customRelationship : selectedRelationship;
        
        if (finalRelationship) {
            // Store relationship data - for now we'll just log it or handle it later
            console.log('Selected relationship:', finalRelationship);
            // TODO: Add relationship field to User type or store in appropriate location
        }

        router.push('/profile_details'); // Navigate to next page
    };

    const isValid = selectedRelationship || (showCustomInput && customRelationship.trim());

    return (
        <SafeAreaView className="flex-1 bg-grey-0">
            <KeyboardAvoidingView 
                className="flex-1" 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <ScrollView 
                    ref={scrollViewRef}
                    contentContainerStyle={{ 
                        paddingBottom: 20,
                        flexGrow: 1
                    }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View className="px-[16px]">
                    {/* Header */}
                    <View className="flex-row items-center mb-[18px]">
                        <TouchableOpacity className="absolute" onPress={() => router.back()}>
                            <Ionicons name="chevron-back" size={24} color="#000" />
                        </TouchableOpacity>
                        <Text className="text-lg font-bold mx-auto">
                            Who is {userData?.firstName || '{Insert Name}'} to you?
                        </Text>
                    </View>

                    {/* Subtitle */}
                    <Text className="text-sm text-grey-80 mb-[30px] text-center">
                        This helps us understand your relationship{"\n"}to the care recipient and ensure the right{"\n"}level of access and consent.
                    </Text>

                    {/* Relationship Options Grid - Hide when custom input is active */}
                    {!showCustomInput && (
                        <View className="flex-wrap flex-row justify-between mb-[20px]">
                            {relationshipOptions.map((option) => (
                                <CustomButton
                                    key={option}
                                    title={option}
                                    handlePress={() => handleRelationshipSelect(option)}
                                    containerStyles={`mb-[12px] rounded-full w-[174px] h-[44px] min-h-[44px] ${
                                        selectedRelationship === option
                                            ? 'bg-brand-blue'
                                            : 'bg-white'
                                    }`}
                                    textStyles={`text-sm font-medium ${
                                        selectedRelationship === option
                                            ? 'text-white'
                                            : 'text-black'
                                    }`}
                                />
                            ))}
                        </View>
                    )}

                    {/* Something Else Button - Only show when custom input is not active */}
                    {!showCustomInput && (
                        <View>
                            <CustomButton
                                title="+ Something Else"
                                handlePress={() => handleRelationshipSelect('Something Else')}
                                containerStyles="rounded-full w-[120px] mx-auto h-[28px] min-h-[28px] bg-[#79797933]"
                                textStyles="text-xs text-black"
                            />
                        </View>
                    )}

                    {/* Custom Input Field - Slides up when active */}
                    {showCustomInput && (
                        <View className="mb-[36px] items-center justify-center" style={{ minHeight: 100 }}>
                            <View className="w-full">
                                {/* Back to options button */}
                                <TouchableOpacity 
                                    onPress={() => {
                                        setShowCustomInput(false);
                                        setCustomRelationship('');
                                        setCustomInputFocused(false);
                                    }}
                                    className="mb-4 flex-row items-center justify-center"
                                >
                                    <Ionicons name="chevron-back" size={16} color="#666" />
                                    <Text className="text-sm text-gray-600 ml-1">Choose from options</Text>
                                </TouchableOpacity>

                                <TextInput
                                    className={`bg-white rounded-lg px-4 py-2.5 text-lg text-black font-medium ${
                                        customInputFocused ? 'border-2 border-brand-blue' : 'border border-gray-200'
                                    }`}
                                    placeholder="Enter relationship"
                                    placeholderTextColor="#9F9FA4"
                                    value={customRelationship}
                                    onChangeText={setCustomRelationship}
                                    onFocus={() => {
                                        setCustomInputFocused(true);
                                        // Scroll to center the input
                                        setTimeout(() => {
                                            scrollViewRef.current?.scrollTo({ 
                                                y: 200, 
                                                animated: true 
                                            });
                                        }, 100);
                                    }}
                                    onBlur={handleCustomInputBlur}
                                    onSubmitEditing={handleCustomInputSubmit}
                                    autoFocus={true}
                                    returnKeyType="done"
                                    blurOnSubmit={true}
                                />
                                
                                {/* Show entered text as confirmation */}
                                {customRelationship.trim() && !customInputFocused && (
                                    <View className="mt-4 items-center">
                                        <Text className="text-lg font-medium text-black">
                                            Relationship: {customRelationship}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    )}
                    </View>
                </ScrollView>

                {/* Bottom Section */}
                <View className="px-[16px] bg-grey-0 pb-[20px]">
                <View className="flex-row mb-[21px] items-center">
                    <Ionicons
                        name="information-circle"
                        size={30}
                        color="#BFBFC3"
                    />
                    <Text className="text-xs text-grey-49 ml-[8px] font-medium">
                        By continuing, you agree with our{' '}
                        <Text className="text-brand-blue">Privacy Policy</Text>.
                    </Text>
                </View>
                <CustomButton
                    title={isValid ? "Done" : "Skip"}
                    handlePress={handleNext}
                    containerStyles="py-4 rounded-lg bg-black"
                    textStyles="text-xl font-medium text-white"
                />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default LovedOneRelationship;
