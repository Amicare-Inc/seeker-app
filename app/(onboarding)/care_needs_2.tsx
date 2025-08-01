import React, { useState } from 'react';
import { PrivacyPolicyLink, PrivacyPolicyModal } from '@/features/privacy';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomButton } from '@/shared/components';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { updateUserFields, setTempFamilyMember } from '@/redux/userSlice';
import helpOptions from '@/assets/helpOptions';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const CareNeeds2: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const userData = useSelector((state: RootState) => state.user.userData);
    const tempFamilyMember = useSelector((state: RootState) => state.user.tempFamilyMember);
    const isPSW = userData?.isPsw;

    const [selectedTasks, setSelectedTasks] = useState<string[]>(
        userData?.carePreferences?.tasks || [],
    );

    const toggleTask = (task: string) => {
        setSelectedTasks((prev) =>
            prev.includes(task)
                ? prev.filter((t) => t !== task)
                : [...prev, task],
        );
    };

    const handleNext = () => {
        if (selectedTasks.length > 0) {
            // Check if this is family care
            const isFamily = userData?.lookingForSelf === false;
            
            console.log('🔍 CARE_NEEDS_2 DEBUG:', {
                lookingForSelf: userData?.lookingForSelf,
                isFamily,
                selectedTasks,
                userData,
                tempFamilyMember
            });
            
            if (isFamily) {
                // Save tasks to family member
                const updatedFamilyMember = {
                    ...tempFamilyMember,
                    carePreferences: {
                        ...tempFamilyMember?.carePreferences,
                        tasks: selectedTasks,
                    }
                };
                console.log('Saving tasks to tempFamilyMember (family care):', updatedFamilyMember);
                dispatch(setTempFamilyMember(updatedFamilyMember));
            } else {
                // Save tasks to core user (self care)
                dispatch(
                    updateUserFields({
                        carePreferences: {
                            ...userData?.carePreferences,
                            tasks: selectedTasks,
                        },
                    }),
                );
                console.log('Tasks updated in Redux:', selectedTasks, userData);
            }
        }
        router.push('/care_schedule'); // Move to the next page regardless
    };

    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const handlePrivacyPolicyPress = () => setShowPrivacyModal(true);

    return (
        <SafeAreaView 
            className="flex-1 bg-grey-0" 
        >
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <View className="px-[16px]">
                    {/* Header */}
                    <View className="flex-row items-center mb-[53px]">
                        <TouchableOpacity className="absolute" onPress={() => router.back()}>
                            <Ionicons name="chevron-back" size={24} color="#000" />
                        </TouchableOpacity>
                        <Text className="text-xl font-semibold mx-auto">
                            Care Needs 2/3
                            {/* should be 2/4 in future */}
                        </Text>
                    </View>

                    {/* Question */}
                    <Text className="text-lg text-grey-80 mb-[34px]">
                        {isPSW
                            ? 'What tasks are you able to assist with?'
                            : 'What kind of tasks would you need help with?'}
                    </Text>

                    {/* Task Options */}
                    <View className="flex-wrap flex-row mb-[75px]">
                        {helpOptions.map((task) => (
                            <CustomButton
                                key={task}
                                title={task}
                                handlePress={() => toggleTask(task)}
                                containerStyles={`mb-[10px] mr-[10px] rounded-full w-full h-[44px] ${
                                    selectedTasks.includes(task)
                                        ? 'bg-brand-blue'
                                        : 'bg-white'
                                }`}
                                textStyles={`text-sm font-medium ${
                                    selectedTasks.includes(task)
                                        ? 'text-white'
                                        : 'text-black'
                                }`}
                            />
                        ))}
                    </View>

                </View>
            </ScrollView>

            {/* Next Button */}
            <View className="px-[16px]">
                <View style={{ flexDirection: 'row', marginBottom: 21, marginTop: 0 }}>
                    <Ionicons
                        name="information-circle"
                        size={30}
                        color="#BFBFC3"
                        style={{ marginRight: 8 }}
                    />
                    <Text style={{ flex: 1, fontSize: 12, color: '#7B7B7E', lineHeight: 16, fontWeight: '500' }}>
                        We use your care preferences to personalize your matches. This info is confidential and only shared with your consent. By continuing, you agree to our{' '}
                        <PrivacyPolicyLink onPress={handlePrivacyPolicyPress} textStyle={{ color: '#0c7ae2' }} /> and <Text style={{ color: '#0c7ae2' }}>Terms of Use</Text>.
                    </Text>
                </View>
                <CustomButton
                    title={selectedTasks.length > 0 ? 'Next' : 'Skip'}
                    handlePress={handleNext}
                    containerStyles="bg-black py-4 rounded-lg"
                    textStyles="text-white text-xl font-medium"
                />
                <PrivacyPolicyModal
                    visible={showPrivacyModal}
                    onClose={() => setShowPrivacyModal(false)}
                />
            </View>
        </SafeAreaView>
    );
};

export default CareNeeds2;