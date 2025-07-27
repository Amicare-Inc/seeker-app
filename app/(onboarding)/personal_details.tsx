import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity, TextInput } from 'react-native';
import { ForumField } from '@/shared/components';
import { CustomButton } from '@/shared/components';
import { StatusBar } from 'expo-status-bar';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { updateUserFields } from '@/redux/userSlice';
import { router } from 'expo-router';
import { DatePickerField } from '@/shared/components';
import { AuthApi } from '@/features/auth/api/authApi';
import { RegionValidatedAddressInput } from '@/shared/components';
import { type AddressComponents } from '@/services/google/googlePlacesService';
import { Ionicons } from '@expo/vector-icons';

const PersonalDetails: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const userData = useSelector((state: RootState) => state.user.userData);

	const [form, setForm] = useState({
		firstName: userData?.firstName || 'Martin',
		lastName: userData?.lastName || 'Droruga',
		dob: userData?.dob || '03/15/1990',
		address: userData?.address || {
			fullAddress: '159 Dundas St E',
			street: '',
			city: '',
			province: '',
			country: '',
			postalCode: '',
		},
		phone: userData?.phone || '5879730077',
		email: userData?.email || '',
		gender: userData?.gender || '',
	});

	const [errors, setErrors] = useState({
		firstName: '',
		lastName: '',
		dob: '',
		address: '',
		phone: '',
		email: '',
		gender: '',
	});

	const [isAddressValid, setIsAddressValid] = useState(false);
	const [focusedFields, setFocusedFields] = useState({
		firstName: false,
		lastName: false,
		phone: false,
		email: false,
		gender: false,
	});

	const handleInputChange = (field: string, value: string) => {
		setForm({ ...form, [field]: value });
		setErrors({ ...errors, [field]: '' });
	};

	const handleFocus = (field: string) => {
		setFocusedFields({
			firstName: false,
			lastName: false,
			phone: false,
			email: false,
			gender: false,
			[field]: true
		});
	};

	const handleBlur = (field: string) => {
		setFocusedFields({ ...focusedFields, [field]: false });
	};

	const handleAddressSelected = (addressData: AddressComponents) => {
		setForm({
			...form,
			address: {
				fullAddress: addressData.fullAddress,
				street: addressData.street,
				city: addressData.city,
				province: addressData.province,
				country: addressData.country,
				postalCode: addressData.postalCode,
			}
		});
		setErrors({ ...errors, address: '' });
	};

	const handleAddressValidation = (isValid: boolean, error?: string) => {
		setIsAddressValid(isValid);
		if (!isValid && error) {
			setErrors({ ...errors, address: error });
		}
	};

	const validateForm = async () => {
		const newErrors: any = {};
		if (!form.firstName) newErrors.firstName = 'First name is required';
		if (!form.lastName) newErrors.lastName = 'Last name is required';
		if (!form.dob) newErrors.dob = 'Date of birth is required';
		if (!form.address.fullAddress) newErrors.address = 'Address is required';
		if (!form.phone) newErrors.phone = 'Phone number is required';
		if (!form.email) newErrors.email = 'Email is required';
		if (!form.gender) newErrors.gender = 'Gender is required';

		// Address validation is now handled by the RegionValidatedAddressInput component
		if (!isAddressValid) {
			newErrors.address = 'Please select a valid address from the suggestions';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleContinue = async () => {
		if (await validateForm()) {
			try {
				const userId = userData?.id;
				if (!userId) {
					console.error('User ID is missing');
					return;
				}
				dispatch(updateUserFields(form));
				
				// Debug: Log the data being sent
				const criticalInfoData = {...form, isPsw: userData!.isPsw};
				console.log('Sending critical info to backend:', criticalInfoData);
				console.log('User ID:', userId);
				
				await AuthApi.addCriticalInfo(userId, criticalInfoData);
				console.log('Critical info sent successfully from personal_details');
				
				router.push('/verification_prompt');
			} catch (error) {
				console.error('Error saving user details:', error);
				// Show alert to user about the error
				alert('Failed to save personal details. Please try again.');
			}
		}
	};

	return (
		<SafeAreaView className="h-full bg-grey-0">
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
							Your Details
						</Text>
					</View>
						<View className="flex-row gap-[14px] mb-4">
							<View className="flex-1 min-w-0">
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
							<View className="flex-1 min-w-0">
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
						</View>

						<DatePickerField
							title="Date of Birth"
							value={form.dob}
							onDateChange={(date) => handleInputChange('dob', date)}
							otherStyles="mb-4 bg-white rounded-lg border border-gray-200"
						/>
						{errors.dob ? (
							<Text className="text-red-500 text-xs">
								{errors.dob}
							</Text>
						) : null}

						<RegionValidatedAddressInput
							placeholder="Address"
							initialValue={form.address.fullAddress}
							onAddressSelected={handleAddressSelected}
							onValidationResult={handleAddressValidation}
							otherStyles="mb-4 border border-gray-200 bg-white rounded-lg"
						/>
						{errors.address ? (
							<Text className="text-red-500 text-xs">
								{errors.address}
							</Text>
						) : null}

						<View className="mb-4">
							<TextInput
								className={`bg-white rounded-lg px-3 py-2.5 text-lg text-black font-medium ${
									focusedFields.phone ? 'border-2 border-brand-blue' : 'border border-gray-200'
								}`}
								placeholder="Phone"
								placeholderTextColor="#9D9DA1"
								value={form.phone}
								onChangeText={(value) => handleInputChange('phone', value)}
								onFocus={() => handleFocus('phone')}
								onBlur={() => handleBlur('phone')}
								keyboardType="phone-pad"
							/>
							{errors.phone ? (
								<Text className="text-red-500 text-xs mt-1">
									{errors.phone}
								</Text>
							) : null}
						</View>

						<View className="mb-4">
							<TextInput
								className={`bg-white rounded-lg px-3 py-2.5 text-lg text-black font-medium ${
									focusedFields.email ? 'border-2 border-brand-blue' : 'border border-gray-200'
								}`}
								placeholder="Email"
								placeholderTextColor="#9D9DA1"
								value={form.email}
								onChangeText={(value) => handleInputChange('email', value)}
								onFocus={() => handleFocus('email')}
								onBlur={() => handleBlur('email')}
								keyboardType="email-address"
							/>
							{errors.email ? (
								<Text className="text-red-500 text-xs mt-1">
									{errors.email}
								</Text>
							) : null}
						</View>

						<View className="mb-4">
							<TextInput
								className={`bg-white rounded-lg px-3 py-2.5 text-lg text-black font-medium ${
									focusedFields.gender ? 'border-2 border-brand-blue' : 'border border-gray-200'
								}`}
								placeholder="Gender"
								placeholderTextColor="#9D9DA1"
								value={form.gender}
								onChangeText={(value) => handleInputChange('gender', value)}
								onFocus={() => handleFocus('gender')}
								onBlur={() => handleBlur('gender')}
							/>
							{errors.gender ? (
								<Text className="text-red-500 text-xs mt-1">
									{errors.gender}
								</Text>
							) : null}
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
			
			<View className="px-[16px]">
				{/* Privacy Notice */}
				<View className="flex flex-row mb-[20px] gap-[14px]">
					<Ionicons name="information-circle" size={28} color="#BFBFC3" />
					<Text className="text-xs text-grey-49 flex-1 leading-4 font-medium">
						We’ll use this to personalize matches and support. This info is confidential and only shared with your consent. By continuing, you agree to our Privacy Policy and Terms of Use.
					</Text>
				</View>
				<CustomButton
					title="Continue"
					handlePress={handleContinue}
					containerStyles="bg-black py-4 rounded-lg"
					textStyles="text-white text-xl font-medium"
				/>
			</View>

		</SafeAreaView>
	);
};

export default PersonalDetails;
