import React, { useState } from 'react';
import {
	View,
	Text,
	SafeAreaView,
	ScrollView,
	TouchableOpacity,
	Image,
	Alert,
} from 'react-native';
import CustomButton from '@/components/CustomButton';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { updateUserFields } from '@/redux/userSlice';
import * as ImagePicker from 'expo-image-picker';
import {
	uploadPhotoToFirebase,
	uploadProfilePhoto,
} from '@/services/firebase/storage';
import { FIREBASE_DB } from '@/firebase.config';
import { doc, setDoc } from 'firebase/firestore';
import { router } from 'expo-router';
// import { X } from 'lucide-react-native';

const AddProfilePhoto: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const userData = useSelector((state: RootState) => state.user.userData);
	const [localPhotoUri, setLocalPhotoUri] = useState<string | null>(null);

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
		if (localPhotoUri && userData?.id) {
			try {
				const downloadURL = await uploadPhotoToFirebase(
					userData.id,
					localPhotoUri,
				);
				dispatch(
					updateUserFields({ profilePhotoUrl: downloadURL || '' }),
				);
				await setDoc(
					doc(FIREBASE_DB, 'test1', userData.id),
					{ profilePhotoUrl: downloadURL },
					{ merge: true },
				);
			} catch (error) {
				console.error('Error uploading photo:', error);
				Alert.alert(
					'Upload Failed',
					'There was an issue uploading your photo. Please try again.',
				);
			}
		}
		router.push('/verification_prompt');
	};

	return (
		<SafeAreaView className="flex-1 bg-white">
			<ScrollView
				contentContainerStyle={{
					flexGrow: 1,
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Text className="text-3xl text-black font-normal mb-3">
					Add Profile Photo
				</Text>
				<Text className="text-sm text-gray-500 font-normal mb-6 text-center">
					Tap the circle below to upload your profile photo
				</Text>

				<View className="relative mb-6">
					<TouchableOpacity
						onPress={handlePhotoSelect}
						className="w-32 h-32 rounded-full bg-gray-200 border-2 border-gray-300 flex items-center justify-center"
					>
						{localPhotoUri ? (
							<Image
								source={{ uri: localPhotoUri }}
								className="w-32 h-32 rounded-full"
							/>
						) : (
							<Text className="text-gray-500">
								Tap to Add Photo
							</Text>
						)}
					</TouchableOpacity>

					{localPhotoUri && (
						<TouchableOpacity
							onPress={handleRemovePhoto}
							className="absolute top-[-4px] right-[-4px] bg-red-500 rounded-full p-1"
						>
							{/* <X size={14} color="white" /> */}
						</TouchableOpacity>
					)}
				</View>
			</ScrollView>
			<View className="px-9 w-full">
				<CustomButton
					title={localPhotoUri ? 'Next' : 'Skip'}
					handlePress={handleDone}
					containerStyles="bg-black py-4 rounded-full"
					textStyles="text-white text-lg"
				/>
			</View>
		</SafeAreaView>
	);
};

export default AddProfilePhoto;
