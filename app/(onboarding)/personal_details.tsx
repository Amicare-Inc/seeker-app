import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { CustomButton } from '@/shared/components';
import { StatusBar } from 'expo-status-bar';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { updateUserFields } from '@/redux/userSlice';
import { router } from 'expo-router';
import { AuthApi } from '@/features/auth/api/authApi';
import Ionicons from '@expo/vector-icons/Ionicons';

const genderOptions = ['Male', 'Female', 'X'];

const PersonalDetails: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const userData = useSelector((state: RootState) => state.user.userData);

	const [form, setForm] = useState({
		firstName: userData?.firstName || '',
		lastName: userData?.lastName || '',
		dob: userData?.dob || '',
		address: userData?.address || {
			fullAddress: '',
			street: '',
			city: '',
			province: '',
			country: '',
			postalCode: '',
		},
		phone: userData?.phone || '',
		email: userData?.email || '',
		gender: userData?.gender || '',
		country: userData?.address?.country || '',
		province: userData?.address?.province || '',
		city: userData?.address?.city || '',
	});

	const [errors, setErrors] = useState({
		firstName: '',
		lastName: '',
		dob: '',
		address: '',
		phone: '',
		email: '',
		gender: '',
		country: '',
		province: '',
		city: '',
	});

	const [showGenderDropdown, setShowGenderDropdown] = useState(false);
	const [focusedFields, setFocusedFields] = useState({
		firstName: false,
		lastName: false,
		phone: false,
		email: false,
		country: false,
		province: false,
		city: false,
		address: false,
		dob: false,
	});

	const handleInputChange = (field: string, value: string) => {
		setForm({ ...form, [field]: value });
		setErrors({ ...errors, [field]: '' });
	};

	const handleFocus = (field: string) => {
		// Close gender dropdown when focusing on any other input
		if (showGenderDropdown) {
			setShowGenderDropdown(false);
		}
		
		// Reset all focus states first, then set the current field
		setFocusedFields({
			firstName: false,
			lastName: false,
			phone: false,
			email: false,
			country: false,
			province: false,
			city: false,
			address: false,
			dob: false,
			[field]: true
		});
	};

	const handleBlur = (field: string) => {
		setFocusedFields({ ...focusedFields, [field]: false });
	};

	const handleScreenTap = () => {
		if (showGenderDropdown) {
			setShowGenderDropdown(false);
		}
		// Clear all focused fields when tapping outside
		setFocusedFields({
			firstName: false,
			lastName: false,
			phone: false,
			email: false,
			country: false,
			province: false,
			city: false,
			address: false,
			dob: false
		});
	};

	const validateForm = async () => {
		const newErrors: any = {};
		if (!form.firstName) newErrors.firstName = 'First name is required';
		if (!form.lastName) newErrors.lastName = 'Last name is required';
		if (!form.phone) newErrors.phone = 'Phone number is required';
		if (!form.email) newErrors.email = 'Email is required';
		if (!form.country) newErrors.country = 'Country is required';
		if (!form.province) newErrors.province = 'Province/State is required';
		if (!form.city) newErrors.city = 'City/Town is required';
		if (!form.address.fullAddress) newErrors.address = 'Address is required';
		if (!form.dob) newErrors.dob = 'Date of birth is required';
		if (!form.gender) newErrors.gender = 'Gender is required';

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
				
				// Update address object with separate fields
				const updatedForm = {
					...form,
					address: {
						...form.address,
						country: form.country,
						province: form.province,
						city: form.city,
					}
				};
				
				dispatch(updateUserFields(updatedForm));
				await AuthApi.addCriticalInfo(userId, {...updatedForm, isPsw: userData!.isPsw});			
				router.push('/profile_details');
			} catch (error) {
				console.error('Error saving user details:', error);
			}
		}
	};

	return (
		<SafeAreaView className="flex-1 bg-grey-0">
			<ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
				<TouchableOpacity 
					activeOpacity={1} 
					onPress={handleScreenTap}
					className="flex-1"
				>
					<View className="px-[16px]">
					{/* Header */}
					<View className="flex-row items-center mb-[36px]">
						<TouchableOpacity className="absolute" onPress={() => router.back()}>
							<Ionicons name="chevron-back" size={24} color="#000" />
						</TouchableOpacity>
						<Text className="text-xl font-semibold mx-auto">
							Your Details
						</Text>
					</View>

					{/* First Name and Last Name Row */}
					<View className="flex-row mb-[15px]">
						<View className="flex-1 mr-2">
							<TextInput
								className={`bg-white rounded-lg px-4 py-2.5 text-lg text-black font-medium ${
									focusedFields.firstName ? 'border-2 border-brand-blue' : 'border border-gray-200'
								}`}
								placeholder="First Name"
								placeholderTextColor="#9F9FA4"
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
							<TextInput
								className={`bg-white rounded-lg px-4 py-2.5 text-lg text-black font-medium ${
									focusedFields.lastName ? 'border-2 border-brand-blue' : 'border border-gray-200'
								}`}
								placeholder="Last Name"
								placeholderTextColor="#9F9FA4"
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

					{/* Phone */}
					<View className="mb-[15px]">
						<TextInput
							className={`bg-white rounded-lg px-4 py-2.5 text-lg text-black font-medium ${
								focusedFields.phone ? 'border-2 border-brand-blue' : 'border border-gray-200'
							}`}
							placeholder="Phone"
							placeholderTextColor="#9F9FA4"
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
					<View className="mb-[15px]">
						<TextInput
							className={`bg-white rounded-lg px-4 py-2.5 text-lg text-black font-medium ${
								focusedFields.email ? 'border-2 border-brand-blue' : 'border border-gray-200'
							}`}
							placeholder="Email"
							placeholderTextColor="#9F9FA4"
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

					{/* Country and Province/State Row */}
					<View className="flex-row mb-[15px]">
						<View className="flex-1 mr-2">
							<TextInput
								className={`bg-white rounded-lg px-4 py-2.5 text-lg text-black font-medium ${
									focusedFields.country ? 'border-2 border-brand-blue' : 'border border-gray-200'
								}`}
								placeholder="Country"
								placeholderTextColor="#9F9FA4"
								value={form.country}
								onChangeText={(value) => handleInputChange('country', value)}
								onFocus={() => handleFocus('country')}
								onBlur={() => handleBlur('country')}
							/>
							{errors.country ? (
								<Text className="text-red-500 text-xs mt-1">
									{errors.country}
								</Text>
							) : null}
						</View>
						<View className="flex-1 ml-2">
							<TextInput
								className={`bg-white rounded-lg px-4 py-2.5 text-lg text-black font-medium ${
									focusedFields.province ? 'border-2 border-brand-blue' : 'border border-gray-200'
								}`}
								placeholder="Province / State"
								placeholderTextColor="#9F9FA4"
								value={form.province}
								onChangeText={(value) => handleInputChange('province', value)}
								onFocus={() => handleFocus('province')}
								onBlur={() => handleBlur('province')}
							/>
							{errors.province ? (
								<Text className="text-red-500 text-xs mt-1">
									{errors.province}
								</Text>
							) : null}
						</View>
					</View>

					{/* City / Town */}
					<View className="mb-[15px]">
						<TextInput
							className={`bg-white rounded-lg px-4 py-2.5 text-lg text-black font-medium ${
								focusedFields.city ? 'border-2 border-brand-blue' : 'border border-gray-200'
							}`}
							placeholder="City / Town"
							placeholderTextColor="#9F9FA4"
							value={form.city}
							onChangeText={(value) => handleInputChange('city', value)}
							onFocus={() => handleFocus('city')}
							onBlur={() => handleBlur('city')}
						/>
						{errors.city ? (
							<Text className="text-red-500 text-xs mt-1">
								{errors.city}
							</Text>
						) : null}
					</View>

					{/* Address */}
					<View className="mb-[15px]">
						<TextInput
							className={`bg-white rounded-lg px-4 py-2.5 text-lg text-black font-medium ${
								focusedFields.address ? 'border-2 border-brand-blue' : 'border border-gray-200'
							}`}
							placeholder="Address"
							placeholderTextColor="#9F9FA4"
							value={form.address.fullAddress}
							onChangeText={(value) => {
								setForm({
									...form,
									address: { ...form.address, fullAddress: value }
								});
								setErrors({ ...errors, address: '' });
							}}
							onFocus={() => handleFocus('address')}
							onBlur={() => handleBlur('address')}
						/>
						{errors.address ? (
							<Text className="text-red-500 text-xs mt-1">
								{errors.address}
							</Text>
						) : null}
					</View>

					{/* Date of Birth */}
					<View className="mb-[15px]">
						<TextInput
							className={`bg-white rounded-lg px-4 py-2.5 text-lg text-black font-medium ${
								focusedFields.dob ? 'border-2 border-brand-blue' : 'border border-gray-200'
							}`}
							placeholder="Date of birth DD.MM.YYYY"
							placeholderTextColor="#9F9FA4"
							value={form.dob}
							onChangeText={(value) => handleInputChange('dob', value)}
							onFocus={() => handleFocus('dob')}
							onBlur={() => handleBlur('dob')}
						/>
						{errors.dob ? (
							<Text className="text-red-500 text-xs mt-1">
								{errors.dob}
							</Text>
						) : null}
					</View>

					{/* Gender Dropdown */}
					<View className="mb-[15px]">
						<TouchableOpacity 
							className={`bg-white rounded-lg px-4 py-2.5 flex-row justify-between items-center ${
								showGenderDropdown ? 'border-2 border-brand-blue' : 'border border-gray-200'
							}`}
							onPress={(e) => {
								e.stopPropagation();
								setShowGenderDropdown(!showGenderDropdown);
							}}
						>
							<Text className={`text-lg font-medium ${form.gender ? 'text-black' : 'text-grey-35'}`}>
								{form.gender || 'Gender: Male/Female/X'}
							</Text>
							<Ionicons 
								name={showGenderDropdown ? "chevron-up" : "chevron-down"} 
								size={20} 
								color="#BFBFC3" 
							/>
						</TouchableOpacity>

						{/* Gender Dropdown Options */}
						{showGenderDropdown && (
							<View className="mb-[15px] overflow-hidden">
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
										onPress={(e) => {
											e.stopPropagation();
											handleInputChange('gender', gender);
											setShowGenderDropdown(false);
										}}
									>
										<Text className="text-base text-black font-normal">{gender}</Text>
										{form.gender === gender && (
											<View className="w-5 h-5 bg-brand-blue rounded-full items-center justify-center">
												<Ionicons name="checkmark" size={14} color="white" />
											</View>
										)}
									</TouchableOpacity>
								))}
							</View>
						)}
						{errors.gender ? (
							<Text className="text-red-500 text-xs mt-1">
								{errors.gender}
							</Text>
						) : null}
					</View>

					</View>
				</TouchableOpacity>
			</ScrollView>

			{/* Continue Button */}
			<View className="px-[16px]">
					<View className="flex-row justify-center mx-auto px-[16px] mb-[21px]">
						<Ionicons
							name="information-circle"
							size={30}
							color="#BFBFC3"
						/>
						<Text className="text-xs text-grey-49 ml-[16px] font-medium">
							We'll use this to personalize matches and support. This info is confidential and only shared with your consent. By continuing, you agree to our{' '}
							<Text className="text-brand-blue">Privacy Policy</Text> and <Text className="text-brand-blue">Terms of Use</Text>.
						</Text>
					</View>
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
