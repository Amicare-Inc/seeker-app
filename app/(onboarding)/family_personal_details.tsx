import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomButton } from '@/shared/components';
import { StatusBar } from 'expo-status-bar';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setTempFamilyMember } from '@/redux/userSlice';
import { router } from 'expo-router';
import { DatePickerField } from '@/shared/components';
import { Ionicons } from '@expo/vector-icons';

const FamilyPersonalDetails: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const userData = useSelector((state: RootState) => state.user.userData);

	const [form, setForm] = useState({
		firstName: '',
		lastName: '',
		dob: '',
		gender: '',
	});

	const [errors, setErrors] = useState({
		firstName: '',
		lastName: '',
		dob: '',
		gender: '',
	});

	const [showGenderModal, setShowGenderModal] = useState(false);
	const [focusedFields, setFocusedFields] = useState({
		firstName: false,
		lastName: false,
	});

	const genderOptions = ['Male', 'Female'];

	const handleInputChange = (field: string, value: string) => {
		setForm({ ...form, [field]: value });
		setErrors({ ...errors, [field]: '' });
	};

	const handleFocus = (field: string) => {
		setFocusedFields({
			firstName: false,
			lastName: false,
			[field]: true
		});
	};

	const handleBlur = (field: string) => {
		setFocusedFields({ ...focusedFields, [field]: false });
	};

	const handleGenderSelect = (gender: string) => {
		handleInputChange('gender', gender);
		setShowGenderModal(false);
	};

	const validateForm = async () => {
		const newErrors: any = {};
		if (!form.firstName) newErrors.firstName = 'First name is required';
		if (!form.lastName) newErrors.lastName = 'Last name is required';
		if (!form.dob) newErrors.dob = 'Date of birth is required';
		if (!form.gender) newErrors.gender = 'Gender is required';

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleContinue = async () => {
		if (await validateForm()) {
			try {
				// Store family member data temporarily in Redux tempFamilyMember field
				dispatch(setTempFamilyMember({
					...form,
					step: 'personal_details'
				}));
				
				console.log('Family member personal details saved:', form);
				router.push('/loved_one_relationship');
			} catch (error) {
				console.error('Error saving family member details:', error);
			}
		}
	};

	return (
		<SafeAreaView className="flex-1 bg-grey-0">
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={{ flex: 1 }}
				keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
			>
				<ScrollView
					contentContainerStyle={{ flexGrow: 1, paddingBottom: 0 }}
					keyboardShouldPersistTaps="handled"
				>
					<View className="px-[16px]">
						<View className="flex-row items-center mb-[22px]">
							<TouchableOpacity className="absolute" onPress={() => router.back()}>
								<Ionicons name="chevron-back" size={24} color="#000" />
							</TouchableOpacity>
							<Text className="text-xl font-medium mx-auto text-center">
								Tell us about your loved one...
							</Text>
						</View>

						<Text className="text-xs text-gray-500 font-normal text-left mb-4">
							This information helps us find the right caregiver for your family member and ensures proper care coordination.
						</Text>

						{/* First Name */}
						<View className="mb-4">
							<Text className="text-sm font-medium text-grey-80 mb-2">First Name</Text>
							<TextInput
								className={`bg-white rounded-lg px-3 py-2.5 text-lg text-black font-medium ${
									focusedFields.firstName ? 'border-2 border-brand-blue' : 'border border-gray-200'
								}`}
								placeholder="First Name"
								placeholderTextColor="#9D9DA1"
								value={form.firstName}
								onChangeText={(value) => handleInputChange('firstName', value)}
								onFocus={() => handleFocus('firstName')}
								onBlur={() => handleBlur('firstName')}
							/>
							{errors.firstName ? (
								<Text className="text-red-500 text-xs mt-1">
									{errors.firstName}
								</Text>
							) : null}
						</View>

						{/* Last Name */}
						<View className="mb-4">
							<Text className="text-sm font-medium text-grey-80 mb-2">Last Name</Text>
							<TextInput
								className={`bg-white rounded-lg px-3 py-2.5 text-lg text-black font-medium ${
									focusedFields.lastName ? 'border-2 border-brand-blue' : 'border border-gray-200'
								}`}
								placeholder="Last Name"
								placeholderTextColor="#9D9DA1"
								value={form.lastName}
								onChangeText={(value) => handleInputChange('lastName', value)}
								onFocus={() => handleFocus('lastName')}
								onBlur={() => handleBlur('lastName')}
							/>
							{errors.lastName ? (
								<Text className="text-red-500 text-xs mt-1">
									{errors.lastName}
								</Text>
							) : null}
						</View>

						{/* Date of Birth */}
						<View className="mb-4">
							<Text className="text-sm font-medium text-grey-80 mb-2">Date of Birth</Text>
							<DatePickerField
								title=""
								value={form.dob}
								onDateChange={(date) => handleInputChange('dob', date)}
								otherStyles="bg-white rounded-lg border border-gray-200"
							/>
							{errors.dob ? (
								<Text className="text-red-500 text-xs mt-1">
									{errors.dob}
								</Text>
							) : null}
						</View>

						{/* Gender Dropdown */}
						<View className="mb-4">
							<Text className="text-sm font-medium text-grey-80 mb-2">Gender</Text>
							<TouchableOpacity
								className={`bg-white rounded-lg px-3 py-2.5 border border-gray-200 flex-row justify-between items-center`}
								onPress={() => setShowGenderModal(true)}
							>
								<Text className={`text-lg font-medium ${form.gender ? 'text-black' : 'text-[#9D9DA1]'}`}>
									{form.gender || 'Select Gender'}
								</Text>
								<Ionicons name="chevron-down" size={20} color="#9D9DA1" />
							</TouchableOpacity>
							{errors.gender ? (
								<Text className="text-red-500 text-xs mt-1">
									{errors.gender}
								</Text>
							) : null}
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
			
			{/* Continue Button */}
			<View className="px-[16px] pb-4">
				<CustomButton
					title="Continue"
					handlePress={handleContinue}
					containerStyles="bg-black py-4 rounded-lg"
					textStyles="text-white text-lg"
				/>
			</View>

			{/* Gender Selection Modal */}
			<Modal
				visible={showGenderModal}
				transparent={true}
				animationType="slide"
				onRequestClose={() => setShowGenderModal(false)}
			>
				<View className="flex-1 justify-end bg-black/50">
					<View className="bg-white rounded-t-xl p-6">
						<View className="flex-row justify-between items-center mb-4">
							<Text className="text-lg font-semibold">Select Gender</Text>
							<TouchableOpacity onPress={() => setShowGenderModal(false)}>
								<Ionicons name="close" size={24} color="#000" />
							</TouchableOpacity>
						</View>
						{genderOptions.map((option) => (
							<TouchableOpacity
								key={option}
								className="py-4 border-b border-gray-100"
								onPress={() => handleGenderSelect(option)}
							>
								<Text className="text-lg font-medium text-black">{option}</Text>
							</TouchableOpacity>
						))}
					</View>
				</View>
			</Modal>

			<StatusBar backgroundColor="#F5F5F5" style="dark" />
		</SafeAreaView>
	);
};

export default FamilyPersonalDetails; 