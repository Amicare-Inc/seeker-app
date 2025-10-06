import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, TextInput } from 'react-native';
// Removed SafeAreaView for better cross-platform compatibility
import { CustomButton } from '@/shared/components';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { updateUserFields, clearTempAvailability } from '@/redux/userSlice';
import * as ImagePicker from 'expo-image-picker';
import { uploadPhotoToFirebase } from '@/services/firebase/storage';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AuthApi } from '@/features/auth/api/authApi';
import { PrivacyPolicyLink, PrivacyPolicyModal } from '@/features/privacy';

const AddProfilePhoto: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const userData = useSelector((state: RootState) => state.user.userData);
	const tempAvailability = useSelector((state: RootState) => state.user.tempAvailability);
	const [localPhotoUri, setLocalPhotoUri] = useState<string | null>(null);
	const [bio, setBio] = useState<string>(''); // Initialize empty, don't use userData.bio as it might contain family member data
	const [isBioFocused, setIsBioFocused] = useState<boolean>(false);
	const [showPrivacyModal, setShowPrivacyModal] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Determine if bio should be shown - Updated to check isPsw first
	const shouldShowBio = userData?.isPsw || userData?.lookingForSelf === true;

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
		if (isSubmitting) return;
		setIsSubmitting(true);
		try {
			let profilePhotoUrl = '';
			
			// Upload photo if selected
			if (localPhotoUri && userData?.id) {
				const downloadURL = await uploadPhotoToFirebase(
					userData.id,
					localPhotoUri,
				);
				console.log('Download URL:', downloadURL);
				profilePhotoUrl = downloadURL || '';
			}
			
			// Update local state
			const updateData: any = { 
				profilePhotoUrl: profilePhotoUrl,
				onboardingComplete: true
			};

			// Only include bio if it should be shown
			if (shouldShowBio) {
				updateData.bio = bio;
			}

			dispatch(updateUserFields(updateData));

			// Send optional info to backend
			if (userData?.id) {
				// Filter out undefined values
				const optionalInfoData: any = {
					profilePhotoUrl: profilePhotoUrl,
					lookingForSelf: userData.lookingForSelf, // Add lookingForSelf as separate parameter
				};

				// Only include bio if it should be shown
				if (shouldShowBio) {
					optionalInfoData.bio = bio;
				}
				
				// Only save care preferences for self care, not family care
				console.log('tempAvailability from Redux:', tempAvailability);
				console.log('existing carePreferences:', userData.carePreferences);
				
				// Check if this is self care or family care
				const isFamily = userData.lookingForSelf === false;
				console.log('Is family care:', isFamily);
				
				// Only include care preferences if this is self care
				if (!isFamily && (userData.carePreferences !== undefined || tempAvailability)) {
					optionalInfoData.carePreferences = {
						...userData.carePreferences,
						...(tempAvailability && { availability: tempAvailability })
					};
					console.log('final carePreferences being sent (self care):', optionalInfoData.carePreferences);
				} else if (isFamily) {
					console.log('Skipping care preferences for family care - they are saved with family member');
				}
				
				if (userData.idVerified !== undefined) {
					optionalInfoData.idVerified = userData.idVerified;
				}
				
				await AuthApi.addOptionalInfo(userData.id, optionalInfoData);
				
				// Clear temp availability after successful save (only for self care)
				if (!isFamily && tempAvailability) {
					dispatch(clearTempAvailability());
				}
				
				// Navigate to appropriate dashboard
				const nextRoute = userData?.isPsw
					? '/(dashboard)/(psw)/psw-home'
					: '/(dashboard)/(seeker)/seeker-home';
				console.log('Profile complete, navigating to:', nextRoute);
				router.push(nextRoute);
			}
		} catch (error) {
			console.error('Error saving profile:', error);
			Alert.alert(
				'Error',
				'There was an issue saving your profile. Please try again.',
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<View className="flex-1 bg-grey-0" style={{ paddingTop: 32, paddingBottom: 32 }}>
			<ScrollView contentContainerStyle={{ paddingBottom: 32, paddingTop: 32 }}>
				<View className="px-[16px]">
					{/* Header */}
					<View className="flex-row items-center mb-[22px]">
						<TouchableOpacity className="absolute" onPress={() => router.back()}>
							<Ionicons name="chevron-back" size={24} color="#000" />
						</TouchableOpacity>
						<Text className="text-xl font-medium mx-auto">
							Add a photo for yourself
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
									<Ionicons name="camera" size={32} color="#303031" />
									<Text className="text-[#303031] text-sm font-medium mt-2">
										Add Photo
									</Text>
								</View>
							)}
						</TouchableOpacity>

													<Text className="text-sm text-grey-80 text-center font-normal px-8">
								A photo will help careseekers recognize{'\n'}you. This is a requirement, but you can skip{'\n'}this for now and add one at a later time.
							</Text>
					</View>

					{/* Bio Section - Conditional */}
					{shouldShowBio && (
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
								className={`bg-white rounded-lg px-3 py-2 text-base font-medium text-black min-h-[158px] ${
									isBioFocused ? 'border-2 border-brand-blue' : 'border border-gray-200'
								}`}
								placeholder="Briefly describe yourself and what kind of care you provide."
								placeholderTextColor="#9D9DA1"
								value={bio}
								onChangeText={setBio}
								onFocus={() => setIsBioFocused(true)}
								onBlur={() => setIsBioFocused(false)}
								multiline
								textAlignVertical="top"
							/>
						</View>
					)}

				</View>
			</ScrollView>

			{/* Finish Button */}
			<View className="px-[16px]">
				{/* Privacy Notice */}
				<View className="flex flex-row mb-[20px] gap-[14px]">
					<Ionicons name="information-circle" size={28} color="#BFBFC3" />
					<Text className="text-xs text-grey-49 flex-1 leading-4 font-medium">
						By continuing, you agree to the public display of your profile (name, photo, bio, neighbourhood, availability, and language) to all users. You can control profile visibility in your profile settings. Learn more in our{' '}
						<PrivacyPolicyLink 
							onPress={() => setShowPrivacyModal(true)}
							textStyle={{ fontSize: 12, fontWeight: '500' }}
						/>
						<Text className="text-brand-blue">.</Text>
					</Text>
				</View>
				<PrivacyPolicyModal 
					visible={showPrivacyModal}
					onClose={() => setShowPrivacyModal(false)}
				/>
				<CustomButton
					title={isSubmitting ? 'Finishing...' : 'Finish'}
					handlePress={handleDone}
					containerStyles={`bg-black py-4 rounded-lg ${isSubmitting ? 'opacity-50' : ''}`}
					textStyles="text-white text-xl font-medium"
				/>
			</View>

			{isSubmitting && (
				<View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} className="bg-black/10 items-center justify-center">
					<Ionicons name="hourglass" size={36} color="#0c7ae2" />
					<Text className="mt-2 text-blue-600">Saving your profile...</Text>
				</View>
			)}
		</View>
	);
};

export default AddProfilePhoto;
