import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Alert, TextInput } from 'react-native';
import CustomButton from '@/components/Global/CustomButton';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { updateUserFields } from '@/redux/userSlice';
import * as ImagePicker from 'expo-image-picker';
import { uploadPhotoToFirebase } from '@/services/firebase/storage';
import { FIREBASE_DB } from '@/firebase.config';
import { doc, setDoc } from 'firebase/firestore';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const AddProfilePhoto: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const userData = useSelector((state: RootState) => state.user.userData);
	const [localPhotoUri, setLocalPhotoUri] = useState<string | null>(null);
	const [bio, setBio] = useState<string>(userData?.bio || '');
	const [isChecked, setIsChecked] = useState<boolean>(false);
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
			if (localPhotoUri && userData?.id) {
			const downloadURL = await uploadPhotoToFirebase(
				userData.id,
				localPhotoUri,
			);
			console.log('Download URL:', downloadURL);
			dispatch(updateUserFields({ 
				profilePhotoUrl: downloadURL || '',
				bio: bio
			}));
			} else {
				dispatch(updateUserFields({ 
					profilePhotoUrl: '',
					bio: bio
				}));
			}
		} catch (error) {
			console.error('Error uploading photo:', error);
			Alert.alert(
				'Upload Failed',
				'There was an issue uploading your photo. Please try again.',
			);
		}
	router.push('/about_loved_one');
	};

	return (
		<SafeAreaView className="flex-1 bg-grey-0">
			<ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
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

					{/* Checkbox Section */}
					{/* <View className="flex-row items-start mb-[32px]">
						<TouchableOpacity
							className={`w-5 h-5 rounded border-2 mr-3 mt-0.5 items-center justify-center ${
								isChecked ? 'bg-brand-blue border-brand-blue' : 'border-gray-300'
							}`}
							onPress={() => setIsChecked(!isChecked)}
						>
							{isChecked && (
								<Ionicons name="checkmark" size={14} color="white" />
							)}
						</TouchableOpacity>
						<Text className="text-xs text-grey-49 flex-1">
							<Text className="font-medium">
								TODO add something here
							</Text>
						</Text>
					</View> */}


				</View>
			</ScrollView>

			{/* Finish Button */}
			<View className="px-[16px]">
									{/* Privacy Notice */}
					<View className="flex flex-row mb-[20px] gap-[14px]">
						<Ionicons name="information-circle" size={28} color="#BFBFC3" />
						<Text className="text-xs text-grey-49 flex-1 leading-4 font-medium">
							By continuing, you agree to the public display of your profile (name, photo, bio, neighbourhood, availability, and language) to all users. You can control profile visibility in your profile settings. Learn more in our{' '}
							<Text className="text-brand-blue">Privacy Policy</Text>.
						</Text>
					</View>
				<CustomButton
					title="Finish"
					handlePress={handleDone}
					containerStyles="bg-black py-4 rounded-lg"
					textStyles="text-white text-xl font-medium"
				/>
			</View>
		</SafeAreaView>
	);
};

export default AddProfilePhoto;
