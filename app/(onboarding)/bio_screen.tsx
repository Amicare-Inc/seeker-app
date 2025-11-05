import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, Alert } from 'react-native';
import { CustomButton } from '@/shared/components';
import { ForumField } from '@/shared/components'; // Reusing your ForumField component
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { updateUserFields } from '@/redux/userSlice';
import { router } from 'expo-router';
import { AuthApi } from '@/features/auth/api/authApi';

const BioScreen: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const userData = useSelector((state: RootState) => state.user.userData);
	const [bio, setBio] = useState(userData?.bio || '');

	const handleFinish = async () => {
		try {
			console.log('User Data in bio before if:', userData);
			dispatch(updateUserFields({ bio }));
			
			// Check if user is in family flow and has family member data
			const lookingForSelf = userData?.lookingForSelf;
			let hasFamilyMemberData = false;
			
			try {
				const tempData = JSON.parse(userData?.bio || '{}');
				hasFamilyMemberData = tempData.type === 'tempFamilyMemberComplete';
			} catch (error) {
				// Not family member data, continue normally
			}
			
			if (userData?.id) {
				await AuthApi.addOptionalInfo(userData.id, { 
					profilePhotoUrl: userData.profilePhotoUrl,
					carePreferences: userData.carePreferences,
					idVerified: userData.idVerified,
					bio: bio,
					onboardingComplete: true
				});
				
				// Only show success alert if completing the entire flow
				if (lookingForSelf !== false || !hasFamilyMemberData) {
					Alert.alert(
						'Success',
						'Your profile has been created successfully!',
					);
				}
			}
			
			// Navigate based on flow
			if (lookingForSelf === false && hasFamilyMemberData) {
				// Family flow complete - go to dashboard
                const nextRoute = userData?.isPsw
                    ? '/(dashboard)/(psw)/psw-sessions'
					: '/(dashboard)/(seeker)/seeker-home';
				console.log('Family flow complete, navigating to:', nextRoute);
				router.push(nextRoute);
			} else {
				// Regular flow - go to dashboard
                const nextRoute = userData?.isPsw
                    ? '/(dashboard)/(psw)/psw-sessions'
					: '/(dashboard)/(seeker)/seeker-home';
				console.log('Regular flow complete, navigating to:', nextRoute);
				router.push(nextRoute);
			}
		} catch (error) {
			console.error('Error saving bio:', error);
			Alert.alert(
				'Error',
				'There was an issue saving your bio. Please try again.',
			);
		}
	};

	return (
		<SafeAreaView className="flex-1 bg-white">
			<ScrollView
				contentContainerStyle={{
					flexGrow: 1,
					justifyContent: 'center',
					paddingHorizontal: 20,
				}}
			>
				<Text className="text-3xl text-black font-normal mb-3 text-center">
					Add a Bio
				</Text>
				<Text className="text-sm text-gray-500 font-normal mb-6 text-center">
					Tell us more about yourself. This is optional and you can
					skip if you’d like.
				</Text>

				<ForumField
					title="Write something about yourself..."
					value={bio}
					handleChangeText={(text) => setBio(text)}
					otherStyles="mb-6 h-40 bg-gray-100 p-4 rounded-xl"
					multiline
					numberOfLines={6}
					textAlignVertical="top"
				/>
			</ScrollView>

			<View className="px-9 w-full">
				<CustomButton
					title="Finish"
					handlePress={handleFinish}
					containerStyles="bg-black py-4 rounded-full"
					textStyles="text-white text-lg"
				/>
			</View>
		</SafeAreaView>
	);
};

export default BioScreen;
