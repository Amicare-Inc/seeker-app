import React, { useState } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomButton } from '@/shared/components';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { updateUserFields, setTempFamilyMember } from '@/redux/userSlice';
import { router } from 'expo-router';
import careTypeOptions from '@/assets/careOptions';
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const CareNeeds1: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const userData = useSelector((state: RootState) => state.user.userData);
	const tempFamilyMember = useSelector((state: RootState) => state.user.tempFamilyMember);
	const isPSW = userData?.isPsw;

	const [lookingForSelf, setLookingForSelf] = useState<boolean | null>(
		userData?.lookingForSelf || null,
	);
	const [selectedCareTypes, setSelectedCareTypes] = useState<string[]>(
		userData?.carePreferences?.careType || [],
	);

	const toggleCareType = (careType: string) => {
		setSelectedCareTypes((prev) =>
			prev.includes(careType)
				? prev.filter((type) => type !== careType)
				: [...prev, careType],
		);
	};

	const handleNext = () => {
		// Update lookingForSelf at top level and carePreferences separately
		const updates: any = {};
		
		// Only set lookingForSelf for non-PSW users (seekers)
		if (!isPSW && lookingForSelf !== null) {
			updates.lookingForSelf = lookingForSelf;
		}
		
		// Check if this is family care
		const isFamily = lookingForSelf === false;
		
		console.log('🔍 CARE_NEEDS_1 DEBUG:', {
			lookingForSelf,
			isFamily,
			isPSW,
			selectedCareTypes,
			userData,
			tempFamilyMember
		});
		
		if (selectedCareTypes.length > 0) {
			if (isFamily) {
				// Save care types to family member
				const updatedFamilyMember = {
					...tempFamilyMember,
					carePreferences: {
						...tempFamilyMember?.carePreferences,
						careType: selectedCareTypes,
					}
				};
				console.log('Saving care types to tempFamilyMember (family care):', updatedFamilyMember);
				dispatch(setTempFamilyMember(updatedFamilyMember));
			} else {
				// Save care types to core user (self care)
				updates.carePreferences = {
					...userData?.carePreferences,
					careType: selectedCareTypes,
				};
			}
		}

		if (Object.keys(updates).length > 0) {
			dispatch(updateUserFields(updates));
			console.log('User data updated in Redux:', updates, userData);
		}

		router.push('/care_needs_2');
	};

	return (
		<SafeAreaView 
			className="flex-1 bg-grey-0" 
		>
			<ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
				<View className="px-[16px]">

					<View className="flex-row items-center mb-[53px]">
						<TouchableOpacity className="absolute" onPress={() => router.back()}>
							<Ionicons name="chevron-back" size={24} color="#000" />
						</TouchableOpacity>
						<Text className="text-xl font-semibold mx-auto">
							Care Needs 1/3 
							{/* should be 1/4 in future */}
						</Text>
					</View>

					{/* Only show "A Loved One" vs "Myself" question for seekers (not PSWs) */}
					{!isPSW && (
						<>
							<Text className="text-lg text-grey-80 mb-[36px]">
								Are you seeking home support for a loved one or yourself?
							</Text>
							<View className="flex-row justify-center mb-[48px]">
								<CustomButton
									title="A Loved One"
									handlePress={() => setLookingForSelf(false)}
									containerStyles={`w-[174px] h-[44px] rounded-full mr-[10px] min-h-[44px] ${
										lookingForSelf === false
											? 'bg-brand-blue'
											: 'bg-white'
									}`}
									textStyles={`text-sm font-medium ${
										lookingForSelf === false
											? 'text-white'
											: 'text-black'
									}`}
								/>
								<CustomButton
									title="Myself"
									handlePress={() => setLookingForSelf(true)}
									containerStyles={`w-[174px] h-[44px] min-h-[44px] rounded-full ${
										lookingForSelf === true
											? 'bg-brand-blue'
											: 'bg-white'
									}`}
									textStyles={`text-base ${
										lookingForSelf === true
											? 'text-white'
											: 'text-black'
									}`}
								/>
							</View>
						</>
					)}

					<Text className="text-lg text-grey-80 mb-[36px]">
						{isPSW
							? 'What types of care do you provide?'
							: 'What types of care are you interested in?'}
					</Text>
					<View className="flex-row flex-wrap mb-[10px]">
					{(() => {
						const leftColumn: string[] = [];
						const rightColumn: string[] = [];
						careTypeOptions.forEach((option, idx) => {
							(idx % 2 === 0 ? leftColumn : rightColumn).push(option);
						});
						return (
							<View className="flex-row w-full">
								<View className="flex-1 mr-[5px]">
									{leftColumn.map((option) => (
										<CustomButton
											key={option}
											title={option}
											handlePress={() => toggleCareType(option)}
											containerStyles={`mb-[10px] rounded-full w-full h-[44px] min-h-[44px] ${
												selectedCareTypes.includes(option)
													? 'bg-brand-blue'
													: 'bg-white'
											}`}
											textStyles={`text-sm font-medium ${
												selectedCareTypes.includes(option)
													? 'text-white'
													: 'text-black'
											}`}
										/>
									))}
								</View>
								<View className="flex-1 ml-[5px]">
									{rightColumn.map((option) => (
										<CustomButton
											key={option}
											title={option}
											handlePress={() => toggleCareType(option)}
											containerStyles={`mb-[10px] rounded-full w-full h-[44px] min-h-[44px] ${
												selectedCareTypes.includes(option)
													? 'bg-brand-blue'
													: 'bg-white'
											}`}
											textStyles={`text-sm font-medium ${
												selectedCareTypes.includes(option)
													? 'text-white'
													: 'text-black'
											}`}
										/>
									))}
								</View>
							</View>
						);
					})()}
					</View>

				</View>
			</ScrollView>

			<View className="px-[16px]">
					<View className="flex-row justify-center mx-auto px-[16px]">
						<Ionicons
							name="information-circle"
							size={30}
							color="#BFBFC3"
						/>
						<Text className="text-xs text-grey-49 mb-[21px] ml-[16px] font-medium">
							We use your care preferences to personalize your matches. This info is confidential and only shared with your consent. By continuing, you agree to our{' '}
							<Text className="text-brand-blue">Privacy Policy</Text> and <Text className="text-brand-blue">Terms of Use</Text>.
						</Text>
					</View>
				<CustomButton
					title={
						selectedCareTypes.length > 0 || lookingForSelf !== null
							? 'Next'
							: 'Skip'
					}
					handlePress={handleNext}
					containerStyles="bg-black py-4 rounded-lg"
					textStyles="text-white text-xl font-medium"
				/>
			</View>
		</SafeAreaView>
	);
};

export default CareNeeds1;
