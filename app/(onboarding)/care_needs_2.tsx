import React, { useState } from 'react';
import { PrivacyPolicyLink, PrivacyPolicyModal } from '@/features/privacy';
import { TermsOfUseLink, TermsOfUseModal } from '@/features/privacy/components/TermsOfUseModal';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomButton } from '@/shared/components';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { updateUserFields, setTempFamilyMember } from '@/redux/userSlice';
import { router } from 'expo-router';
import { deriveCareTypesFromTasks } from '@/shared/constants/carePreferencesOnboarding';
import Ionicons from '@expo/vector-icons/Ionicons';
import CarePreferencesCategorySections from '@/features/profile/components/CarePreferencesCategorySections';

const CareNeeds2: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const userData = useSelector((state: RootState) => state.user.userData);
    const tempFamilyMember = useSelector((state: RootState) => state.user.tempFamilyMember);

    const isFamily = userData?.lookingForSelf === false;
    const initialTasks = isFamily
        ? tempFamilyMember?.carePreferences?.tasks || []
        : userData?.carePreferences?.tasks || [];

    const [selectedTasks, setSelectedTasks] = useState<string[]>(initialTasks);

    const toggleTask = (task: string) => {
        setSelectedTasks((prev) =>
            prev.includes(task)
                ? prev.filter((t) => t !== task)
                : [...prev, task],
        );
    };

    const handleNext = () => {
        const isFamilyNow = userData?.lookingForSelf === false;
        const derivedTypes = deriveCareTypesFromTasks(selectedTasks);

        console.log('🔍 CARE_NEEDS_2 DEBUG:', {
            lookingForSelf: userData?.lookingForSelf,
            isFamily: isFamilyNow,
            selectedTasks,
            userData,
            tempFamilyMember,
        });

        if (isFamilyNow) {
            const updatedFamilyMember = {
                ...tempFamilyMember,
                carePreferences: {
                    ...tempFamilyMember?.carePreferences,
                    tasks: selectedTasks,
                    careType: derivedTypes,
                },
            };
            dispatch(setTempFamilyMember(updatedFamilyMember));
        } else {
            dispatch(
                updateUserFields({
                    carePreferences: {
                        ...userData?.carePreferences,
                        tasks: selectedTasks,
                        careType: derivedTypes,
                    },
                }),
            );
        }
        router.push('/care_schedule');
    };

    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const handlePrivacyPolicyPress = () => setShowPrivacyModal(true);
    const handleTermsOfUsePress = () => setShowTermsModal(true);

    return (
        <SafeAreaView 
            className="flex-1 bg-grey-0" 
        >
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <View className="px-[16px]">
                    {/* Header */}
                    <View className="flex-row items-center mb-[40px]">
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
                        What kind of help are you seeking?
                    </Text>

                    <CarePreferencesCategorySections
                        selectedTasks={selectedTasks}
                        onToggleTask={toggleTask}
                    />

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
                        <PrivacyPolicyLink onPress={handlePrivacyPolicyPress} textStyle={{ color: '#0c7ae2' }} /> and <TermsOfUseLink onPress={handleTermsOfUsePress} textStyle={{ color: '#0c7ae2' }} />.
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
                <TermsOfUseModal
                    visible={showTermsModal}
                    onClose={() => setShowTermsModal(false)}
                />
            </View>
        </SafeAreaView>
    );
};

export default CareNeeds2;