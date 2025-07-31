import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Alert, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { CustomButton } from '@/shared/components';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setTempFamilyMember, clearTempFamilyMember } from '@/redux/userSlice';
import { FamilyApi } from '@/features/family/api/familyApi';
import * as ImagePicker from 'expo-image-picker';
import { uploadPhotoToFirebase } from '@/services/firebase/storage';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getCurrentUserUid } from '@/lib/auth';

const FamilyProfileDetails: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const userData = useSelector((state: RootState) => state.user.userData);
	const tempFamilyMember = useSelector((state: RootState) => state.user.tempFamilyMember);
	const [localPhotoUri, setLocalPhotoUri] = useState<string | null>(null);
	const [bio, setBio] = useState<string>('');
	const [isBioFocused, setIsBioFocused] = useState<boolean>(false);

	const handlePhotoSelect = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.7,
		});

		if (!result.canceled) {
			setLocalPhotoUri(result.assets[0].uri);
		}
	};

	const handleRemovePhoto = () => {
		setLocalPhotoUri(null);
	};

	const handleDone = async () => {
		try {
			console.log('🔍 FAMILY_PROFILE_DETAILS DEBUG - tempFamilyMember at start:', tempFamilyMember);
			console.log('🔍 FAMILY_PROFILE_DETAILS DEBUG - userData:', userData);
			
			const currentUserUid = getCurrentUserUid();
			let familyMemberPhotoUrl = '';
			
			// Upload photo if selected
			if (localPhotoUri && currentUserUid) {
				familyMemberPhotoUrl = await uploadPhotoToFirebase(
					`${currentUserUid}_family_${Date.now()}`,
					localPhotoUri,
				);
				console.log('Family member photo uploaded:', familyMemberPhotoUrl);
			}

			// Create complete family member data
			const completeFamilyMemberData = {
				firstName: tempFamilyMember?.firstName || '',
				lastName: tempFamilyMember?.lastName || '',
				relationshipToUser: tempFamilyMember?.relationshipToUser || '',
				address: tempFamilyMember?.address || {
					fullAddress: '',
					street: '',
					city: '',
					province: '',
					country: '',
					postalCode: ''
				},
				profilePhotoUrl: familyMemberPhotoUrl || '',
				bio: bio || '',
				// Include care preferences (availability, care types, tasks) from tempFamilyMember
				...(tempFamilyMember?.carePreferences && { carePreferences: tempFamilyMember.carePreferences }),
			};

			// Filter out undefined values to prevent JSON parsing errors
			const cleanedData = Object.fromEntries(
				Object.entries(completeFamilyMemberData).filter(([_, value]) => value !== undefined)
			);

			console.log('Sending family member data to backend:', cleanedData);
			
			// Log specifically if carePreferences are present
			if (tempFamilyMember?.carePreferences) {
				console.log('Care preferences in tempFamilyMember:', tempFamilyMember.carePreferences);
				console.log('Care preferences in cleanedData:', cleanedData.carePreferences);
			} else {
				console.warn('No care preferences found in tempFamilyMember');
			}

			// Send family member data to backend
			if (currentUserUid) {
				try {
					console.log('🔍 FAMILY_PROFILE_DETAILS DEBUG - Using UID:', currentUserUid);
					const result = await FamilyApi.addFamilyMember(currentUserUid, cleanedData);
					console.log('Family member saved to Firestore:', result);
					
					// Clear temporary family member data from Redux
					dispatch(clearTempFamilyMember());
					
					Alert.alert(
						'Success',
						'Family member profile created successfully!',
					);
				} catch (error) {
					console.error('Error saving family member to Firestore:', error);
					Alert.alert(
						'Error',
						`Failed to save family member: ${error instanceof Error ? error.message : 'Unknown error'}`,
					);
					return;
				}
			} else {
				console.error('No authenticated user UID found');
				Alert.alert(
					'Error',
					'Authentication error. Please sign in again.',
				);
				return;
			}

			console.log('Family member profile details saved');
			// Navigate to personal details for the main user
			router.push('/personal_details');
		} catch (error) {
			console.error('Error saving family member profile details:', error);
			Alert.alert(
				'Error',
				'There was an issue saving the profile details. Please try again.',
			);
		}
	};

	return (
		<SafeAreaView className="flex-1 bg-grey-0">
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={{ flex: 1 }}
			>
			<ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
				<View className="px-[16px]">
					{/* Header */}
					<View className="flex-row items-center mb-[22px]">
						<TouchableOpacity className="absolute" onPress={() => router.back()}>
							<Ionicons name="chevron-back" size={24} color="#000" />
						</TouchableOpacity>
						<Text className="text-xl font-medium mx-auto text-center">
							Consider adding a photo{"\n"}for your loved one
						</Text>
					</View>

					{/* Photo Upload Section */}
					<View className="items-center mb-[42px]">
						<TouchableOpacity
							onPress={handlePhotoSelect}
							className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center mb-[22px]"
						>
							{localPhotoUri ? (
								<Image
									source={{ uri: localPhotoUri }}
									className="w-[100px] h-[100px] rounded-full bg-[#E1E1E6]"
								/>
							) : (
								<View className="items-center">
									<Ionicons name="camera" size={32} color="#797979" />
									<Text className="text-[#797979] text-sm font-medium mt-2">
										Add Photo
									</Text>
								</View>
							)}
						</TouchableOpacity>

						<Text className="text-sm text-grey-80 text-center font-normal px-8">
							A photo will help caregivers recognize{'\n'}your loved one. This is optional, but you can{'\n'}add one now or later.
						</Text>
					</View>

					{/* Bio Section */}
					<View className="mb-[32px]">
						<View className="flex-row items-center mb-[14px] mx-auto">
							<Text className="text-lg text-grey-80 font-bold">
								Add bio (Optional)
							</Text>
							<View className="ml-1">
								<Ionicons name="information-circle-outline" size={22} color="#303031" />
							</View>
						</View>

						<TextInput
							className={`bg-white rounded-lg px-3 py-2 text-base font-medium text-black min-h-[180px] ${
								isBioFocused ? 'border-2 border-brand-blue' : 'border border-gray-200'
							}`}
							placeholder="Briefly describe your relationship with your loved one and what kind of caregiver you are seeking on your loved one's behalf. Avoid listing medical history or other private data."
							placeholderTextColor="#9D9DA1"
							value={bio}
							onChangeText={setBio}
							onFocus={() => setIsBioFocused(true)}
							onBlur={() => setIsBioFocused(false)}
							multiline
							numberOfLines={4}
							textAlignVertical="top"
						/>
					</View>

				</View>
			</ScrollView>
			</KeyboardAvoidingView>
			{/* Continue Button */}
			<View className="px-[16px]">
				{/* Privacy Notice */}
				<View className="flex flex-row mb-[20px] gap-[14px]">
					<Ionicons name="information-circle" size={28} color="#BFBFC3" />
					<Text className="text-xs text-grey-49 flex-1 leading-4 font-medium">
						This information helps caregivers provide better care for your loved one. You can update this information at any time in your profile settings.
					</Text>
				</View>
				<CustomButton
					title="Continue"
					handlePress={handleDone}
					containerStyles="bg-black py-4 rounded-lg"
					textStyles="text-white text-xl font-medium"
				/>
			</View>

		</SafeAreaView>
	);
};

export default FamilyProfileDetails; 