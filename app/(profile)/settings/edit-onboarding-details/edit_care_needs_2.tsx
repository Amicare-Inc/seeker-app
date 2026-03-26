import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomButton } from '@/shared/components';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { updateUserFields } from '@/redux/userSlice';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { deriveCareTypesFromTasks } from '@/shared/constants/carePreferencesOnboarding';
import CarePreferencesCategorySections from '@/features/profile/components/CarePreferencesCategorySections';

const CareNeeds2: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const userData = useSelector((state: RootState) => state.user.userData);
    

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
        const derivedTypes = deriveCareTypesFromTasks(selectedTasks);
        dispatch(
            updateUserFields({
                carePreferences: {
                    ...userData?.carePreferences,
                    tasks: selectedTasks,
                    careType: derivedTypes,
                },
            }),
        );
        router.back();
    };

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
                            Care Needs 2/2
                        </Text>
                    </View>

                    {/* Question */}
                    <Text className="text-lg text-grey-80 mb-[34px]">
                        What kind of help are you seeking? Select all that apply under each category.
                    </Text>

                    <CarePreferencesCategorySections
                        selectedTasks={selectedTasks}
                        onToggleTask={toggleTask}
                    />

                </View>
            </ScrollView>

            {/* Next Button */}
            <View className="px-[16px]">
				
                    {/* Privacy Notice */}
                    <View className="flex-row justify-center mx-auto px-[16px]">
                        <Ionicons
                            name="information-circle"
                            size={30}
                            color="#BFBFC3"
                        />
                        <Text className="text-xs text-grey-49 mb-[21px] ml-[16px] font-medium">
                            We use your care preferences to personalize your matches. This info is confidential and only shared with your consent. By continuing, you agree to our{' '}
                            <Text className="text-brand-blue">Privacy Policy</Text> and <Text className="text-brand-blue">Terms of Use</Text>.
                        </Text>
                    </View>
                <CustomButton
                    title={selectedTasks.length > 0 ? 'Next' : 'Skip'}
                    handlePress={handleNext}
                    containerStyles="bg-black py-4 rounded-lg"
                    textStyles="text-white text-xl font-medium"
                />
            </View>
        </SafeAreaView>
    );
};

export default CareNeeds2;