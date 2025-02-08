import React, { useState } from 'react';
import { View, Text, Image, SafeAreaView, ScrollView } from 'react-native';
import CustomButton from '@/components/CustomButton';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { updateUserFields } from '@/redux/userSlice';
import { router } from 'expo-router';

const CarePreferences: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const userData = useSelector((state: RootState) => state.user.userData);
    const isPSW = userData?.isPsw;

    const [lookingForSelf, setLookingForSelf] = useState<boolean | null>(userData?.carePreferences?.lookingForSelf || null);
    const [selectedCareTypes, setSelectedCareTypes] = useState<string[]>(userData?.carePreferences?.careType || []);

    const careOptions = [
        'Option 1',
        'Option 2',
        'Option 3',
        'Option 4',
        'Option 5',
        'Option 6',
        'Option 7',
        'Option 8',
    ];

    const toggleCareType = (careType: string) => {
        setSelectedCareTypes((prev) =>
            prev.includes(careType)
                ? prev.filter((type) => type !== careType)
                : [...prev, careType]
        );
    };

    const handleNext = () => {
        const carePreferences = {
            lookingForSelf: isPSW ? false : lookingForSelf ?? undefined,
            careType: selectedCareTypes.length ? selectedCareTypes : undefined,
        };

        if (selectedCareTypes.length > 0 || lookingForSelf !== null) {
            dispatch(updateUserFields({ carePreferences }));
            console.log('Care preferences updated in Redux:', carePreferences);
        }

        router.push('/tasks'); // Move to the next page regardless
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <Image
                    source={{ uri: 'https://via.placeholder.com/300x150.png' }}
                    className="w-full h-40 mb-6"
                    resizeMode="cover"
                />

                <View className="px-6">
                    {!isPSW && (
                        <>
                            <Text className="text-lg font-bold text-black mb-4">
                                Are you looking for home support for yourself or a loved one?
                            </Text>
                            <View className="flex-row justify-center mb-8">
                                <CustomButton
                                    title="Myself"
                                    handlePress={() => setLookingForSelf(true)}
                                    containerStyles={`flex-1 mx-2 py-4 rounded-full ${
                                        lookingForSelf === true ? 'bg-blue-500' : 'bg-gray-200'
                                    }`}
                                    textStyles={`text-base ${
                                        lookingForSelf === true ? 'text-white' : 'text-black'
                                    }`}
                                />
                                <CustomButton
                                    title="Someone else"
                                    handlePress={() => setLookingForSelf(false)}
                                    containerStyles={`flex-1 mx-2 py-4 rounded-full ${
                                        lookingForSelf === false ? 'bg-blue-500' : 'bg-gray-200'
                                    }`}
                                    textStyles={`text-base ${
                                        lookingForSelf === false ? 'text-white' : 'text-black'
                                    }`}
                                />
                            </View>
                        </>
                    )}

                    <Text className="text-lg font-bold text-black mb-4">
                        {isPSW ? 'What types of care do you provide?' : 'What types of care are you interested in?'}
                    </Text>
                    <View className="flex-wrap flex-row justify-between">
                        {careOptions.map((option) => (
                            <CustomButton
                                key={option}
                                title={option}
                                handlePress={() => toggleCareType(option)}
                                containerStyles={`w-[48%] mb-4 py-4 rounded-full ${
                                    selectedCareTypes.includes(option) ? 'bg-blue-500' : 'bg-gray-200'
                                }`}
                                textStyles={`text-sm ${
                                    selectedCareTypes.includes(option) ? 'text-white' : 'text-black'
                                }`}
                            />
                        ))}
                    </View>
                </View>
            </ScrollView>

            <View className="px-9 pb-0">
                <CustomButton
                    title={selectedCareTypes.length > 0 || lookingForSelf !== null ? 'Next' : 'Skip'}
                    handlePress={handleNext}
                    containerStyles="bg-black py-4 rounded-full"
                    textStyles="text-white text-lg"
                />
            </View>
        </SafeAreaView>
    );
};

export default CarePreferences;