import React, { useState } from 'react';
import { View, Text, Image, SafeAreaView, ScrollView } from 'react-native';
import CustomButton from '@/components/CustomButton';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebase.config';
import { setUserDoc } from '@/services/firebase/firestore'; // Assuming setUserDoc is imported here
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { router } from 'expo-router';

const CarePreferences: React.FC = () => {
    const [lookingForSelf, setLookingForSelf] = useState<boolean | null>(null);
    const [selectedCareTypes, setSelectedCareTypes] = useState<string[]>([]);
    const [user] = useAuthState(FIREBASE_AUTH);

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

    const handleDone = async () => {
        if (user && lookingForSelf !== null) {
            try {
                const carePreferences = {
                    lookingForSelf,
                    careType: selectedCareTypes,
                };

                // Save care preferences to Firestore
                const userDocRef = doc(FIREBASE_DB, 'personal', user.uid);
                await updateDoc(userDocRef, { carePreferences });

                console.log('Care preferences saved successfully.');
                // Navigate to the personal details page
                router.push('/tasks');
            } catch (error) {
                console.error('Failed to save care preferences:', error);
            }
        } else {
            alert('Please select who you are looking for and at least one care type.');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                {/* Header Image */}
                <Image
                    source={{
                        uri: 'https://via.placeholder.com/300x150.png',
                    }}
                    className="w-full h-40 mb-6"
                    resizeMode="cover"
                />

                <View className="px-6">
                    {/* Question 1 */}
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

                    {/* Question 2 */}
                    <Text className="text-lg font-bold text-black mb-4">
                        What type of care are you interested in?
                    </Text>
                    <View className="flex-wrap flex-row justify-between">
                        {careOptions.map((option, index) => (
                            <CustomButton
                                key={option}
                                title={option}
                                handlePress={() => toggleCareType(option)}
                                containerStyles={`w-[48%] mb-4 py-4 rounded-full ${
                                    selectedCareTypes.includes(option)
                                        ? 'bg-blue-500'
                                        : 'bg-gray-200'
                                }`}
                                textStyles={`text-sm ${
                                    selectedCareTypes.includes(option)
                                        ? 'text-white'
                                        : 'text-black'
                                }`}
                            />
                        ))}
                    </View>

                    {/* Done Button */}
                    <CustomButton
                        title="Done"
                        handlePress={handleDone}
                        containerStyles="mt-8 bg-black py-4 rounded-full"
                        textStyles="text-white text-lg"
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default CarePreferences;