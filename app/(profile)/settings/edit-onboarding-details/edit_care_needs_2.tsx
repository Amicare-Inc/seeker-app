import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { CustomButton } from '@/shared/components';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { updateUserFields } from '@/redux/userSlice';
import helpOptions from '@/assets/helpOptions';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const CareNeeds2: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const userData = useSelector((state: RootState) => state.user.userData);
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
        router.push('/care_schedule'); // Move to the next page regardless
    };

    return (
        <SafeAreaView className="flex-1 bg-grey-0">
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <View className="px-[16px]">
                    {/* Header */}
                    <View className="flex-row items-center mb-[53px]">
                        <TouchableOpacity className="absolute" onPress={() => router.back()}>
                            <Ionicons name="chevron-back" size={24} color="#000" />
                        </TouchableOpacity>
                        <Text className="text-xl font-semibold mx-auto">
                            Care Needs 2/4
                        </Text>
                    </View>

                    {/* Question */}
                    <Text className="text-lg text-grey-80 mb-[34px]">
                        {isPSW
                            ? 'What tasks are you able to assist with?'
                            : 'What kind of tasks would you need help with?'}
                    </Text>

                    {/* Task Options */}
                    <View className="flex-wrap flex-row -mr-[10px] mb-[75px]">
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