import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import CustomButton from '@/components/Global/CustomButton';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { updateUserFields } from '@/redux/userSlice';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const languageOptions = [
    'English',
    'French', 
    'Chinese (Mandarin or Cantonese)',
    'Arabic',
    'Filipino / Tagalog',
    'German',
    'Spanish',
    'Italian',
    'Portuguese',
    'Russian'
];

const genderOptions = [
    'Male',
    'Female', 
    'Unspecified'
];

const drivingOptions = [
    'Yes',
    'No'
];

const CaregiverPreferences: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const userData = useSelector((state: RootState) => state.user.userData);

    const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
        (userData?.carePreferences as any)?.languages || [],
    );
    const [selectedGender, setSelectedGender] = useState<string>(
        (userData?.carePreferences as any)?.gender || '',
    );
    const [canDrive, setCanDrive] = useState<string>(
        (userData?.carePreferences as any)?.canDrive || '',
    );
    const [searchText, setSearchText] = useState<string>('');
    
    // Dropdown states (changed from modal states)
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [showGenderDropdown, setShowGenderDropdown] = useState(false);
    const [showDrivingDropdown, setShowDrivingDropdown] = useState(false);

    const toggleLanguage = (language: string) => {
        setSelectedLanguages((prev) =>
            prev.includes(language)
                ? prev.filter((l) => l !== language)
                : [...prev, language],
        );
        // Close dropdown after selection
        setShowLanguageDropdown(false);
        setSearchText(''); // Clear search text
    };

    // Filter languages based on search text
    const filteredLanguages = languageOptions.filter(language =>
        language.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleDone = () => {
        const updatedCarePreferences = {
            ...userData?.carePreferences,
            languages: selectedLanguages,
            gender: selectedGender,
            canDrive: canDrive,
        };

        dispatch(updateUserFields({ carePreferences: updatedCarePreferences }));
        console.log('Caregiver preferences updated:', updatedCarePreferences);
        router.push('/about_loved_one'); // Navigate to next page
    };

    return (
        <SafeAreaView className="flex-1 bg-grey-0">
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <View className="px-[16px]">
                    {/* Header */}
                    <View className="flex-row items-center mb-[39px]">
                        <TouchableOpacity className="absolute" onPress={() => router.back()}>
                            <Ionicons name="chevron-back" size={24} color="#000" />
                        </TouchableOpacity>
                        <Text className="text-xl font-semibold mx-auto">
                            4/4 Caregiver Preferences
                        </Text>
                    </View>

                    {/* Language Preferences */}
                    <Text className="text-base mb-[8px] font-medium">
                        Language Preferences
                    </Text>
                    <TouchableOpacity 
                        className={`bg-white rounded-lg px-3 py-2.5 mb-[12px] flex-row items-center ${
                            showLanguageDropdown ? 'border-2 border-brand-blue' : 'border border-grey-9'
                        }`}
                        onPress={() => {
                            setShowLanguageDropdown(!showLanguageDropdown);
                            setShowGenderDropdown(false);
                            setShowDrivingDropdown(false);
                            if (!showLanguageDropdown) {
                                setSearchText(''); // Clear search when opening
                            }
                        }}
                    >
                        <View className="flex-1">
                            {showLanguageDropdown ? (
                                <TextInput
                                    className="text-base text-black"
                                    placeholder="Search languages..."
                                    value={searchText}
                                    onChangeText={setSearchText}
                                    style={{ fontSize: 18 }} // Ensures text-base (16px)
                                />
                            ) : (
                                <Text className={`text-lg ${selectedLanguages.length > 0 ? 'text-black' : 'text-grey-35'}`}>
                                    {selectedLanguages.length > 0 ? selectedLanguages.join(', ') : 'Select all that apply'}
                                </Text>
                            )}
                        </View>
                        <View className="ml-2">
                            <Ionicons 
                                name={showLanguageDropdown ? "chevron-up" : "chevron-down"} 
                                size={20} 
                                color="#BFBFC3" 
                            />
                        </View>
                    </TouchableOpacity>

                    {/* Language Dropdown */}
                    {showLanguageDropdown && (
                        <View className="mb-[20px] overflow-hidden">
                            {/* Language Options */}
                            {filteredLanguages.map((language, index) => (
                                <TouchableOpacity
                                    key={language}
                                    className={`px-1 py-3 flex-row justify-between items-center ${
                                        index === 0 ? 'rounded-t-lg' : ''
                                    } ${
                                        index === filteredLanguages.length - 1 ? 'rounded-b-lg' : ''
                                    } ${
                                        index < filteredLanguages.length - 1 ? 'border-b border-grey-9' : ''
                                    }`}
                                    onPress={() => toggleLanguage(language)}
                                >
                                    <Text className={`text-base text-black ${
                                        selectedLanguages.includes(language) ? 'font-bold' : 'font-normal'
                                    }`}>{language}</Text>
                                    {selectedLanguages.includes(language) && (
                                        <View className="w-5 h-5 bg-brand-blue rounded-full items-center justify-center">
                                            <Ionicons name="checkmark" size={14} color="white" />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                            {filteredLanguages.length === 0 && searchText.length > 0 && (
                                <View className="bg-white px-4 py-4 rounded-lg">
                                    <Text className="text-base text-grey-49">No languages found</Text>
                                </View>
                            )}
                        </View>
                    )}

                    {/* Caregiver Gender Preference */}
                    {!showLanguageDropdown && (
                        <>
                            <Text className="text-base mb-[8px] font-medium">
                                Caregiver Gender Preference
                            </Text>
                            <TouchableOpacity 
                                className={`bg-white rounded-lg px-3 py-2.5 mb-[12px] flex-row justify-between items-center ${
                                    showGenderDropdown ? 'border-2 border-brand-blue' : 'border border-grey-9'
                                }`}
                                onPress={() => {
                                    setShowGenderDropdown(!showGenderDropdown);
                                    setShowLanguageDropdown(false);
                                    setShowDrivingDropdown(false);
                                }}
                            >
                                <Text className={`text-lg ${selectedGender ? 'text-black' : 'text-grey-35'}`}>
                                    {selectedGender || 'Male / Female / Unspecified'}
                                </Text>
                                <Ionicons 
                                    name={showGenderDropdown ? "chevron-up" : "chevron-down"} 
                                    size={20} 
                                    color="#BFBFC3" 
                                />
                            </TouchableOpacity>

                            {/* Gender Dropdown */}
                            {showGenderDropdown && (
                                <View className="mb-[20px] overflow-hidden">
                                    {genderOptions.map((gender, index) => (
                                        <TouchableOpacity
                                            key={gender}
                                            className={`px-1 py-3 flex-row justify-between items-center ${
                                                index === 0 ? 'rounded-t-lg' : ''
                                            } ${
                                                index === genderOptions.length - 1 ? 'rounded-b-lg' : ''
                                            } ${
                                                index < genderOptions.length - 1 ? 'border-b border-grey-9' : ''
                                            }`}
                                            onPress={() => {
                                                setSelectedGender(gender);
                                                setShowGenderDropdown(false);
                                            }}
                                        >
                                            <Text className={`text-base text-black ${
                                                selectedGender === gender ? 'font-bold' : 'font-normal'
                                            }`}>{gender}</Text>
                                            {selectedGender === gender && (
                                                <View className="w-5 h-5 bg-brand-blue rounded-full items-center justify-center">
                                                    <Ionicons name="checkmark" size={14} color="white" />
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </>
                    )}

                    {/* Driving Preference */}
                    <Text className="text-base mb-[8px] font-medium">
                        Do you prefer a caregiver who can drive?
                    </Text>
                    <TouchableOpacity 
                        className={`bg-white rounded-lg px-3 py-2.5 mb-[12px] flex-row justify-between items-center ${
                            showDrivingDropdown ? 'border-2 border-brand-blue' : 'border border-grey-9'
                        }`}
                        onPress={() => {
                            setShowDrivingDropdown(!showDrivingDropdown);
                            setShowLanguageDropdown(false);
                            setShowGenderDropdown(false);
                        }}
                    >
                        <Text className={`text-lg ${canDrive ? 'text-black' : 'text-grey-35'}`}>
                            {canDrive || 'Y/N'}
                        </Text>
                        <Ionicons 
                            name={showDrivingDropdown ? "chevron-up" : "chevron-down"} 
                            size={20} 
                            color="#BFBFC3" 
                        />
                    </TouchableOpacity>

                    {/* Driving Dropdown */}
                    {showDrivingDropdown && (
                        <View className="mb-[75px] overflow-hidden">
                            {drivingOptions.map((option, index) => (
                                <TouchableOpacity
                                    key={option}
                                    className={`px-1 py-3 flex-row justify-between items-center ${
                                        index === 0 ? 'rounded-t-lg' : ''
                                    } ${
                                        index === drivingOptions.length - 1 ? 'rounded-b-lg' : ''
                                    } ${
                                        index < drivingOptions.length - 1 ? 'border-b border-grey-9' : ''
                                    }`}
                                    onPress={() => {
                                        setCanDrive(option);
                                        setShowDrivingDropdown(false);
                                    }}
                                >
                                    <Text className={`text-base text-black ${
                                        canDrive === option ? 'font-bold' : 'font-normal'
                                    }`}>{option}</Text>
                                    {canDrive === option && (
                                        <View className="w-5 h-5 bg-brand-blue rounded-full items-center justify-center">
                                            <Ionicons name="checkmark" size={14} color="white" />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                </View>
            </ScrollView>

            {/* Done Button */}
            <View className="px-[16px]">
                {/* Privacy Notice */}
                <View className="flex-row justify-center mx-auto px-[16px]">
                    <Ionicons
                        name="information-circle"
                        size={30}
                        color="#BFBFC3"
                    />
                    <Text className="text-xs text-grey-49 mb-[21px] ml-[14px] font-medium">
                        We'll use this to personalize matches and support. This info is confidential and only shared with your consent. By continuing, you agree to our{' '}
                        <Text className="text-brand-blue">Privacy Policy</Text> and <Text className="text-brand-blue">Terms of Use</Text>.
                    </Text>
                </View>
                <CustomButton
                    title="Done"
                    handlePress={handleDone}
                    containerStyles="bg-black py-4 rounded-lg"
                    textStyles="text-white text-xl font-medium"
                />
            </View>
        </SafeAreaView>
    );
};

export default CaregiverPreferences;