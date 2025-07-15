import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CustomButton } from '@/shared/components';

export interface PersonalDetailsData {
	firstName: string;
	lastName: string;
	dob: string;
	gender: string;
	address: {
		fullAddress: string;
		street: string;
		city: string;
		province: string;
		country: string;
		postalCode: string;
	};
	phone?: string;
	email?: string;
	country: string;
	province: string;
	city: string;
}

interface PersonalDetailsFormProps {
	title: string;
	subtitle?: string;
	showPhone?: boolean;
	showEmail?: boolean;
	initialData?: Partial<PersonalDetailsData>;
	onSubmit: (data: PersonalDetailsData) => void;
	onBack?: () => void;
	submitButtonText?: string;
}

const genderOptions = ['Male', 'Female', 'X'];

export const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({
	title,
	subtitle,
	showPhone = true,
	showEmail = true,
	initialData = {},
	onSubmit,
	onBack,
	submitButtonText = 'Continue'
}) => {
	const [form, setForm] = useState<PersonalDetailsData>({
		firstName: initialData.firstName || '',
		lastName: initialData.lastName || '',
		dob: initialData.dob || '',
		address: initialData.address || {
			fullAddress: '',
			street: '',
			city: '',
			province: '',
			country: '',
			postalCode: '',
		},
		phone: initialData.phone || '',
		email: initialData.email || '',
		gender: initialData.gender || '',
		country: initialData.country || '',
		province: initialData.province || '',
		city: initialData.city || '',
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
		if (showGenderDropdown) {
			setShowGenderDropdown(false);
		}
		
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
		if (showPhone && !form.phone) newErrors.phone = 'Phone number is required';
		if (showEmail && !form.email) newErrors.email = 'Email is required';
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
			const updatedForm = {
				...form,
				address: {
					...form.address,
					country: form.country,
					province: form.province,
					city: form.city,
				}
			};
			onSubmit(updatedForm);
		}
	};

	const handleBack = () => {
		if (onBack) {
			onBack();
		} else {
			router.back();
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
							<TouchableOpacity className="absolute" onPress={handleBack}>
								<Ionicons name="chevron-back" size={24} color="#000" />
							</TouchableOpacity>
							<Text className="text-xl font-semibold mx-auto">
								{title}
							</Text>
						</View>

						{subtitle && (
							<Text className="text-sm text-grey-80 mb-[21px] leading-5 text-center mx-auto">
								{subtitle}
							</Text>
						)}

						{/* First Name and Last Name Row */}
						<View className="flex-row mb-[15px]">
							<View className="flex-1 mr-2">
								<TextInput
									className={`h-[56px] px-4 border rounded-lg text-base ${
										focusedFields.firstName ? 'border-brand-blue' : 'border-grey-20'
									}`}
									placeholder="First Name"
									placeholderTextColor="#999"
									value={form.firstName}
									onChangeText={(value) => handleInputChange('firstName', value)}
									onFocus={() => handleFocus('firstName')}
									onBlur={() => handleBlur('firstName')}
								/>
								{errors.firstName ? (
									<Text className="text-red-500 text-sm mt-1">{errors.firstName}</Text>
								) : null}
							</View>
							<View className="flex-1 ml-2">
								<TextInput
									className={`h-[56px] px-4 border rounded-lg text-base ${
										focusedFields.lastName ? 'border-brand-blue' : 'border-grey-20'
									}`}
									placeholder="Last Name"
									placeholderTextColor="#999"
									value={form.lastName}
									onChangeText={(value) => handleInputChange('lastName', value)}
									onFocus={() => handleFocus('lastName')}
									onBlur={() => handleBlur('lastName')}
								/>
								{errors.lastName ? (
									<Text className="text-red-500 text-sm mt-1">{errors.lastName}</Text>
								) : null}
							</View>
						</View>

						{/* Phone Number (conditional) */}
						{showPhone && (
							<View className="mb-[15px]">
								<TextInput
									className={`h-[56px] px-4 border rounded-lg text-base ${
										focusedFields.phone ? 'border-brand-blue' : 'border-grey-20'
									}`}
									placeholder="Phone Number"
									placeholderTextColor="#999"
									value={form.phone}
									onChangeText={(value) => handleInputChange('phone', value)}
									onFocus={() => handleFocus('phone')}
									onBlur={() => handleBlur('phone')}
									keyboardType="phone-pad"
								/>
								{errors.phone ? (
									<Text className="text-red-500 text-sm mt-1">{errors.phone}</Text>
								) : null}
							</View>
						)}

						{/* Email (conditional) */}
						{showEmail && (
							<View className="mb-[15px]">
								<TextInput
									className={`h-[56px] px-4 border rounded-lg text-base ${
										focusedFields.email ? 'border-brand-blue' : 'border-grey-20'
									}`}
									placeholder="Email"
									placeholderTextColor="#999"
									value={form.email}
									onChangeText={(value) => handleInputChange('email', value)}
									onFocus={() => handleFocus('email')}
									onBlur={() => handleBlur('email')}
									keyboardType="email-address"
								/>
								{errors.email ? (
									<Text className="text-red-500 text-sm mt-1">{errors.email}</Text>
								) : null}
							</View>
						)}

						{/* Country, Province, City Row */}
						<View className="flex-row mb-[15px]">
							<View className="flex-1 mr-1">
								<TextInput
									className={`h-[56px] px-4 border rounded-lg text-base ${
										focusedFields.country ? 'border-brand-blue' : 'border-grey-20'
									}`}
									placeholder="Country"
									placeholderTextColor="#999"
									value={form.country}
									onChangeText={(value) => handleInputChange('country', value)}
									onFocus={() => handleFocus('country')}
									onBlur={() => handleBlur('country')}
								/>
								{errors.country ? (
									<Text className="text-red-500 text-sm mt-1">{errors.country}</Text>
								) : null}
							</View>
							<View className="flex-1 mx-1">
								<TextInput
									className={`h-[56px] px-4 border rounded-lg text-base ${
										focusedFields.province ? 'border-brand-blue' : 'border-grey-20'
									}`}
									placeholder="Province/State"
									placeholderTextColor="#999"
									value={form.province}
									onChangeText={(value) => handleInputChange('province', value)}
									onFocus={() => handleFocus('province')}
									onBlur={() => handleBlur('province')}
								/>
								{errors.province ? (
									<Text className="text-red-500 text-sm mt-1">{errors.province}</Text>
								) : null}
							</View>
							<View className="flex-1 ml-1">
								<TextInput
									className={`h-[56px] px-4 border rounded-lg text-base ${
										focusedFields.city ? 'border-brand-blue' : 'border-grey-20'
									}`}
									placeholder="City/Town"
									placeholderTextColor="#999"
									value={form.city}
									onChangeText={(value) => handleInputChange('city', value)}
									onFocus={() => handleFocus('city')}
									onBlur={() => handleBlur('city')}
								/>
								{errors.city ? (
									<Text className="text-red-500 text-sm mt-1">{errors.city}</Text>
								) : null}
							</View>
						</View>

						{/* Address */}
						<View className="mb-[15px]">
							<TextInput
								className={`h-[56px] px-4 border rounded-lg text-base ${
									focusedFields.address ? 'border-brand-blue' : 'border-grey-20'
								}`}
								placeholder="Address"
								placeholderTextColor="#999"
								value={form.address.fullAddress}
								onChangeText={(value) => setForm({ ...form, address: { ...form.address, fullAddress: value } })}
								onFocus={() => handleFocus('address')}
								onBlur={() => handleBlur('address')}
							/>
							{errors.address ? (
								<Text className="text-red-500 text-sm mt-1">{errors.address}</Text>
							) : null}
						</View>

						{/* Date of Birth */}
						<View className="mb-[15px]">
							<TextInput
								className={`h-[56px] px-4 border rounded-lg text-base ${
									focusedFields.dob ? 'border-brand-blue' : 'border-grey-20'
								}`}
								placeholder="Date of Birth (MM/DD/YYYY)"
								placeholderTextColor="#999"
								value={form.dob}
								onChangeText={(value) => handleInputChange('dob', value)}
								onFocus={() => handleFocus('dob')}
								onBlur={() => handleBlur('dob')}
							/>
							{errors.dob ? (
								<Text className="text-red-500 text-sm mt-1">{errors.dob}</Text>
							) : null}
						</View>

						{/* Gender Dropdown */}
						<View className="mb-[15px]">
							<TouchableOpacity
								className={`h-[56px] px-4 border rounded-lg flex-row items-center justify-between ${
									showGenderDropdown ? 'border-brand-blue' : 'border-grey-20'
								}`}
								onPress={() => setShowGenderDropdown(!showGenderDropdown)}
							>
								<Text className={`text-base ${form.gender ? 'text-black' : 'text-grey-60'}`}>
									{form.gender || 'Gender'}
								</Text>
								<Ionicons 
									name={showGenderDropdown ? 'chevron-up' : 'chevron-down'} 
									size={20} 
									color="#999" 
								/>
							</TouchableOpacity>
							{errors.gender ? (
								<Text className="text-red-500 text-sm mt-1">{errors.gender}</Text>
							) : null}
						</View>

						{/* Gender Options */}
						{showGenderDropdown && (
							<View className="mb-[15px] border border-grey-20 rounded-lg bg-white">
								{genderOptions.map((option) => (
									<TouchableOpacity
										key={option}
										className="h-[56px] px-4 flex-row items-center border-b border-grey-10 last:border-b-0"
										onPress={() => {
											handleInputChange('gender', option);
											setShowGenderDropdown(false);
										}}
									>
										<Text className="text-base text-black">{option}</Text>
									</TouchableOpacity>
								))}
							</View>
						)}
					</View>
				</TouchableOpacity>
			</ScrollView>

			{/* Continue Button */}
			<View className="px-[16px] pb-[20px]">
				<CustomButton
					title={submitButtonText}
					handlePress={handleContinue}
					containerStyles="bg-black py-4 rounded-lg"
					textStyles="text-white text-xl font-medium"
				/>
			</View>
		</SafeAreaView>
	);
}; 