import React, { useState } from 'react';
import { PrivacyPolicyLink, PrivacyPolicyModal } from '@/features/privacy';
import { TermsOfUseLink, TermsOfUseModal } from '@/features/privacy/components/TermsOfUseModal';
import { View, Text, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomButton } from '@/shared/components';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { updateUserFields, setTempFamilyMember } from '@/redux/userSlice';
import { router } from 'expo-router';
const careTypeOptions = [
  'Household Tasks',
  'Personal Care & Mobility',
  'Social & Cognitive Support',
  'Transportation',
];
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const CareNeeds1: React.FC = () => {
	const [showPrivacyModal, setShowPrivacyModal] = useState(false);
	const [showTermsModal, setShowTermsModal] = useState(false);
	const handlePrivacyPolicyPress = () => setShowPrivacyModal(true);
	const handleTermsOfUsePress = () => setShowTermsModal(true);
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

					<View className="flex-row items-center mb-[30px]">
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
							<Text className="text-lg text-grey-80 mb-[26px]">
								Are you seeking home support for a loved one or yourself?
							</Text>
							<View className="mb-[30px]">
								<CustomButton
									title="A Loved One"
									handlePress={() => setLookingForSelf(false)}
									containerStyles={`w-full h-[44px] rounded-full mr-[10px] min-h-[44px] mb-[10px] ${
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
									containerStyles={`w-full h-[44px] min-h-[44px] rounded-full ${
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

					<Text className="text-lg text-grey-80 mb-[26px]">
						{isPSW
							? 'What types of care do you provide?'
							: 'What types of care are you interested in?'}
					</Text>
					<View className="flex-col mb-[10px]">
					{(() => {
		const unavailableOptions = ['Personal Care & Mobility', 'Transportation'];
		const available = careTypeOptions.filter(option => !unavailableOptions.includes(option));
		const unavailable = careTypeOptions.filter(option => unavailableOptions.includes(option));
		const sortedOptions = [...available, ...unavailable];
		return sortedOptions.map((option) => {
		  const isUnavailable = unavailableOptions.includes(option);
		  return (
			<CustomButton
			  key={option}
			  title={option}
			  handlePress={isUnavailable ? () => {} : () => toggleCareType(option)}
			  containerStyles={`mb-[10px] rounded-full w-full h-[44px] min-h-[44px] ${
				selectedCareTypes.includes(option)
				  ? 'bg-brand-blue'
				  : 'bg-white'
			  }`}
			  textStyles={`text-sm font-medium ${
				isUnavailable
				  ? 'text-grey-35'
				  : selectedCareTypes.includes(option)
				  ? 'text-white'
				  : 'text-black'
			  }`}
			/>
		  );
		});
					})()}
					</View>

		<Text className="mb-[24px] text-grey-49 text-xs px-1">
		  Personal Care & Mobility and Transportation are currently unavailable during our beta phase.
		</Text>

				</View>
			</ScrollView>

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
					title={
						selectedCareTypes.length > 0 || lookingForSelf !== null
							? 'Next'
							: 'Skip'
					}
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

export default CareNeeds1;
