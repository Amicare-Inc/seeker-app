import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomButton } from '@/shared/components';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { updateUserFields, setTempFamilyMember } from '@/redux/userSlice';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { PrivacyPolicyLink, PrivacyPolicyModal } from '@/features/privacy';

const relationshipOptions = [
    'Mom', 'Dad', 'Grandma', 'Grandpa',
    'Sister', 'Brother', 'Aunt', 'Uncle',
    'Mother-in-law', 'Father-in-law', 'Partner', 'Other Relative',
    'Friend', 'Client'
];

const LovedOneRelationship: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const userData = useSelector((state: RootState) => state.user.userData);
    const tempFamilyMember = useSelector((state: RootState) => state.user.tempFamilyMember);
    const scrollViewRef = useRef<ScrollView>(null);

    const [selectedRelationship, setSelectedRelationship] = useState<string>('');
    const [customRelationship, setCustomRelationship] = useState<string>('');
    const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
    const [customInputFocused, setCustomInputFocused] = useState<boolean>(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);


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

    const handlePrivacyPolicyPress = () => {
        setShowPrivacyModal(true);
    };

    const handleNext = () => {
        const finalRelationship = showCustomInput ? customRelationship : selectedRelationship;
        
        if (finalRelationship) {
            // Update tempFamilyMember with relationship data
            const updatedFamilyMember = {
                ...tempFamilyMember,
                relationshipToUser: finalRelationship,
            };
            
            console.log('🔍 LOVED_ONE_RELATIONSHIP DEBUG - Before update:', {
                existingTempFamilyMember: tempFamilyMember,
                finalRelationship,
                updatedFamilyMember
            });
            
            dispatch(setTempFamilyMember(updatedFamilyMember));
            console.log('Updated family member with relationship:', updatedFamilyMember);
        }

        router.push('/family_profile_details'); // Navigate to family profile details
    };

    const isValid = selectedRelationship || (showCustomInput && customRelationship.trim());

    return (
        <SafeAreaView 
            className="flex-1 bg-grey-0" 
        >
            <KeyboardAvoidingView 
                className="flex-1" 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 60}
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

                        <Text className="text-lg font-bold mx-auto">
                            Who is {tempFamilyMember?.firstName || 'your loved one'} to you?
                        </Text>
                    </View>

                    {/* Subtitle */}
                    <Text className="text-sm text-grey-80 mb-[30px] text-center">
                        This helps us understand your relationship{"\n"}to the care recipient and ensure the right{"\n"}level of access and consent.
                    </Text>

                    {/* Relationship Options Grid - Hide when custom input is active */}
                    {!showCustomInput && (
                        <View className="flex-row justify-between mb-[20px]">
                            {(() => {
                                const leftColumn: string[] = [];
                                const rightColumn: string[] = [];
                                relationshipOptions.forEach((option, idx) => {
                                    (idx % 2 === 0 ? leftColumn : rightColumn).push(option);
                                });
                                return (
                                    <>
                                        <View className="flex-1 mr-[5px]">
                                            {leftColumn.map((option) => (
                                                <CustomButton
                                                    key={option}
                                                    title={option}
                                                    handlePress={() => handleRelationshipSelect(option)}
                                                    containerStyles={`mb-[12px] rounded-full w-full h-[44px] min-h-[44px] ${
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
                                        <View className="flex-1 ml-[5px]">
                                            {rightColumn.map((option) => (
                                                <CustomButton
                                                    key={option}
                                                    title={option}
                                                    handlePress={() => handleRelationshipSelect(option)}
                                                    containerStyles={`mb-[12px] rounded-full w-full h-[44px] min-h-[44px] ${
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
                                    </>
                                );
                            })()}
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
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 21}}>
                    <Ionicons
                        name="information-circle"
                        size={30}
                        color="#BFBFC3"
                        style={{ marginRight: 8 }}
                    />
                    <Text style={{ 
                        flex: 1, 
                        fontSize: 12, 
                        color: '#7B7B7E', 
                        lineHeight: 16, 
                        fontWeight: '500' 
                    }}>
                        By continuing, you agree with our{' '}
                        <PrivacyPolicyLink 
                            onPress={handlePrivacyPolicyPress}
                            textStyle={{ color: '#0c7ae2'}}
                        />
                        <Text className="text-brand-blue">.</Text>
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

            <PrivacyPolicyModal 
                visible={showPrivacyModal}
                onClose={() => setShowPrivacyModal(false)}
            />
        </SafeAreaView>
    );
};

export default LovedOneRelationship;
