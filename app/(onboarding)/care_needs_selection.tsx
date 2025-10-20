import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CustomButton } from '@/shared/components';

const careOptions = [
    { id: 'personal', title: 'Personal Care', selected: false },
    { id: 'medication', title: 'Medication Mgmt', selected: false },
    { id: 'mobility', title: 'Mobility', selected: false },
    { id: 'household', title: 'Household Tasks', selected: false },
    { id: 'companionship', title: 'Companionship', selected: false },
    { id: 'transportation', title: 'Transportation', selected: false },
    { id: 'errands', title: 'Errands', selected: false },
];

const CareNeedsSelection = () => {
    const [selectedOptions, setSelectedOptions] = useState(
        careOptions.map(option => ({ ...option }))
    );
    const [careRecipient, setCareRecipient] = useState<'loved-one' | 'myself' | null>(null);

    const toggleOption = (id: string) => {
        setSelectedOptions(prev =>
            prev.map(option =>
                option.id === id ? { ...option, selected: !option.selected } : option
            )
        );
    };

    const handleNext = () => {
        const selected = selectedOptions.filter(option => option.selected);
        console.log('Selected care needs:', selected);
        console.log('Care recipient:', careRecipient);
        router.push('/availability'); // Navigate to next step
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar backgroundColor="#FFFFFF" style="dark" />
            
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-lg font-medium">Care Needs 1/4</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView className="flex-1 px-6">
                {/* Question */}
                <Text className="text-xl font-medium text-center mb-6 leading-7">
                    Are you seeking home support for a loved one or yourself?
                </Text>

                {/* Care Recipient Selection */}
                <View className="flex-row mb-8 gap-3">
                    <TouchableOpacity
                        onPress={() => setCareRecipient('loved-one')}
                        className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-full ${
                            careRecipient === 'loved-one' ? 'bg-blue-500' : 'bg-gray-200'
                        }`}
                    >
                        <View className="w-6 h-6 rounded-full bg-white mr-2 items-center justify-center">
                            <View className="w-4 h-4 rounded-full bg-blue-500" />
                        </View>
                        <Text className={`font-medium ${
                            careRecipient === 'loved-one' ? 'text-white' : 'text-black'
                        }`}>
                            A Loved One
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setCareRecipient('myself')}
                        className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-full ${
                            careRecipient === 'myself' ? 'bg-blue-500' : 'bg-gray-200'
                        }`}
                    >
                        <View className="w-6 h-6 rounded-full bg-white mr-2 items-center justify-center">
                            <View className="w-4 h-4 rounded-full bg-green-500" />
                        </View>
                        <Text className={`font-medium ${
                            careRecipient === 'myself' ? 'text-white' : 'text-black'
                        }`}>
                            Myself
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Care Type Question */}
                <Text className="text-lg font-medium mb-4">
                    What type of care are you interested in?
                </Text>

                {/* Care Options Grid */}
                <View className="flex-row flex-wrap gap-3 mb-8">
                    {selectedOptions.map((option) => (
                        <TouchableOpacity
                            key={option.id}
                            onPress={() => toggleOption(option.id)}
                            className={`px-4 py-3 rounded-full ${
                                option.selected ? 'bg-blue-500' : 'bg-gray-200'
                            }`}
                        >
                            <Text className={`font-medium ${
                                option.selected ? 'text-white' : 'text-black'
                            }`}>
                                {option.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Privacy Notice */}
                <View className="flex-row items-start mb-6">
                    <Ionicons name="information-circle" size={20} color="#9CA3AF" className="mr-2 mt-0.5" />
                    <Text className="text-xs text-gray-500 leading-4 flex-1 ml-2">
                        We use your care preferences to personalize your experience. You can update your preferences at any time. By continuing, we agree to our{' '}
                        <Text className="text-blue-500 underline">Privacy Policy</Text> of Amicare.
                    </Text>
                </View>
            </ScrollView>

            {/* Next Button */}
            <View className="px-6 pb-6">
                <CustomButton
                    title="Next"
                    handlePress={handleNext}
                    containerStyles="w-full bg-black py-4 rounded-xl"
                    textStyles="text-white text-lg font-medium"
                />
            </View>
        </SafeAreaView>
    );
};

export default CareNeedsSelection;