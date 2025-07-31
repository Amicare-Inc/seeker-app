import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity, TextInput } from 'react-native';
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

const genderOptions = ['Male', 'Female', 'Other'];

const PersonalDetails: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const userData = useSelector((state: RootState) => state.user.userData);
	const tempFamilyMember = useSelector((state: RootState) => state.user.tempFamilyMember);

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
	const [showGenderDropdown, setShowGenderDropdown] = useState(false);
	const [focusedFields, setFocusedFields] = useState({
		firstName: false,
		lastName: false,
		phone: false,
		email: false,
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
					throw new Error('User ID not found in Redux state');
				}

				const criticalInfoData = {
					isPsw: userData?.isPsw || false,
					firstName: form.firstName,
					lastName: form.lastName,
					dob: form.dob,
					address: form.address,
					phone: form.phone,
					email: form.email,
					gender: form.gender,
				};

				await AuthApi.addCriticalInfo(userId, criticalInfoData);

				// Update Redux with the personal details
				dispatch(updateUserFields({
					firstName: form.firstName,
					lastName: form.lastName,
					dob: form.dob,
					address: form.address,
					phone: form.phone,
					gender: form.gender,
				}));

				router.push('/verification_prompt');
			} catch (error) {
				console.error('Error saving user details:', error);
				alert('Failed to save personal details. Please try again.');
			}
		}
	};

	return (
		<SafeAreaView className="flex-1 bg-grey-0">
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
				style={{ flex: 1 }}
				keyboardVerticalOffset={0}
			>
				<ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
					<View className="px-[16px]">
						{/* Header */}
						<View className="flex-row items-center justify-center mb-[17px] relative">
							<TouchableOpacity className="absolute left-0" onPress={() => router.back()}>
								<Ionicons name="chevron-back" size={24} color="#000" />
							</TouchableOpacity>
							<Text className="text-lg font-bold text-center">
								Tell us about yourself
							</Text>
						</View>

						{/* Subtitle */}
						<Text className="text-sm text-grey-80 mb-[21px] leading-5 text-center mx-auto">
							We use this information to create your profile and{"\n"}verify your identity. This info is stored securely{"\n"}and only shared with your consent.
						</Text>

						{/* First Name and Last Name Row */}
						<View className="flex-row mb-[15px]">
							<View className="flex-1 mr-2">
								<Text className="text-base font-medium text-black mb-[8px]">First Name</Text>
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
							<View className="flex-1 ml-2">
								<Text className="text-base font-medium text-black mb-[8px]">Last Name</Text>
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

						{/* Address */}
						<View className="mb-[15px]">
							<Text className="text-base font-medium text-black mb-[8px]">Address</Text>
							<RegionValidatedAddressInput
								placeholder="e.g. 24 Willow Street, A1B 2C3"
								initialValue={form.address.fullAddress}
								onAddressSelected={handleAddressSelected}
								onValidationResult={handleAddressValidation}
								otherStyles="bg-white rounded-lg border border-gray-200"
							/>
							{errors.address ? (
								<Text className="text-red-500 text-xs mt-1">
									{errors.address}
								</Text>
							) : null}
						</View>



						{/* Date of Birth and Gender Row */}
						<View className="flex-row mb-[15px]">
							<View className="flex-1 mr-2">
								<View className="flex-row items-center mb-[8px]">
									<Text className="text-base font-medium text-black">Date of Birth</Text>
									<Ionicons name="information-circle-outline" size={20} color="#303031" style={{ marginLeft: 4 }} />
								</View>
								<DatePickerField
									title=""
									value={form.dob}
									onDateChange={(date: string) => handleInputChange('dob', date)}
									otherStyles="bg-white border border-gray-200 rounded-lg"
								/>
								{errors.dob ? (
									<Text className="text-red-500 text-xs mt-1">
										{errors.dob}
									</Text>
								) : null}
							</View>
							<View className="flex-1 ml-2">
								<View className="flex-row items-center mb-[8px]">
									<Text className="text-base font-medium text-black">Gender</Text>
									<Ionicons name="information-circle-outline" size={20} color="#303031" style={{ marginLeft: 4 }} />
								</View>
								<TouchableOpacity 
									className={`bg-white rounded-lg px-4 py-2.5 flex-row justify-between items-center ${
										showGenderDropdown ? 'border-2 border-brand-blue' : 'border border-gray-200'
									}`}
									onPress={() => setShowGenderDropdown(!showGenderDropdown)}
								>
									<Text className={`text-lg font-medium ${form.gender ? 'text-black' : 'text-grey-35'}`}>
										{form.gender || '...'}
									</Text>
									<Ionicons 
										name={showGenderDropdown ? "chevron-up" : "chevron-down"} 
										size={20} 
										color="#BFBFC3" 
									/>
								</TouchableOpacity>
								{errors.gender ? (
									<Text className="text-red-500 text-xs mt-1">
										{errors.gender}
									</Text>
								) : null}
							</View>
						</View>

						{/* Gender Dropdown Options */}
						{showGenderDropdown && (
							<View className="mb-[20px] overflow-hidden">
								{genderOptions.map((gender, index) => (
									<TouchableOpacity
										key={gender}
										className={`bg-white px-4 py-4 flex-row justify-between items-center ${
											index === 0 ? 'rounded-t-lg' : ''
										} ${
											index === genderOptions.length - 1 ? 'rounded-b-lg' : ''
										} ${
											index < genderOptions.length - 1 ? 'border-b border-gray-200' : ''
										}`}
										onPress={() => {
											handleInputChange('gender', gender);
											setShowGenderDropdown(false);
										}}
									>
										<Text className={`text-base text-black ${
											form.gender === gender ? 'font-bold' : 'font-normal'
										}`}>
											{gender}
										</Text>
										{form.gender === gender && (
											<View className="w-5 h-5 bg-brand-blue rounded-full items-center justify-center">
												<Ionicons name="checkmark" size={14} color="white" />
											</View>
										)}
									</TouchableOpacity>
								))}
							</View>
						)}

						{/* Phone */}
						<View className="mb-[15px]">
							<Text className="text-base font-medium text-black mb-[8px]">Phone</Text>
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

						{/* Email */}
						<View className="mb-[26px]">
							<Text className="text-base font-medium text-black mb-[8px]">Email</Text>
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
								editable={false} // Email is already set from registration
								style={{ opacity: 0.6 }}
							/>
							{errors.email ? (
								<Text className="text-red-500 text-xs mt-1">
									{errors.email}
								</Text>
							) : null}
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>

			{/* Continue Button */}
			<View className="px-[16px] pb-[21px]">
				<CustomButton
					title="Continue"
					handlePress={handleContinue}
					containerStyles="bg-black py-4 rounded-lg"
					textStyles="text-white text-xl font-medium"
				/>
			</View>
			<StatusBar backgroundColor="#FFFFFF" style="dark" />
		</SafeAreaView>
	);
};

export default PersonalDetails;
