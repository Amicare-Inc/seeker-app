import React, { useState } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomButton } from '@/shared/components';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { updateUserFields } from '@/redux/userSlice';
import { router } from 'expo-router';
import careTypeOptions from '@/assets/careOptions';
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const CareNeeds1: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const userData = useSelector((state: RootState) => state.user.userData);


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

		updates.lookingForSelf = lookingForSelf;
	
		
		if (selectedCareTypes.length > 0) {
			updates.carePreferences = {
				...userData?.carePreferences,
				careType: selectedCareTypes,
			};
		}

		if (Object.keys(updates).length > 0) {
			dispatch(updateUserFields(updates));
			console.log('Care preferences updated in Redux:', updates, userData);
		}

		router.push('/care_needs_2'); // Move to the next page regardless
	};

	return (
		<SafeAreaView 
			className="flex-1 bg-grey-0" 
		>
			<ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
				<View className="px-[16px]">

						<>
						<View className="flex-row items-center mb-[53px]">
							<TouchableOpacity className="absolute" onPress={() => router.back()}>
								<Ionicons name="chevron-back" size={24} color="#000" />
							</TouchableOpacity>
							<Text className="text-xl font-semibold mx-auto">
								Care Needs 1/2
							</Text>
						</View>
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

					<Text className="text-lg text-grey-80 mb-[36px]">
						'What types of care are you interested in?'
					</Text>
					<View className="flex-wrap flex-row -mr-[10px] mb-[75px]">
					{careTypeOptions.map((option) => (
						<CustomButton
						key={option}
						title={option}
						handlePress={() => toggleCareType(option)}
						containerStyles={`mb-[10px] mr-[10px] rounded-full w-[174px] h-[44px] min-h-[44px] ${
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
