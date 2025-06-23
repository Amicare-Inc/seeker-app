import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import ForumField from '@/components/Global/ForumField';
import CustomButton from '@/components/Global/CustomButton';
import { StatusBar } from 'expo-status-bar';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { updateUserFields } from '@/redux/userSlice';
import { router } from 'expo-router';
import DatePickerField from '@/components/Global/DatePickerField';
import { Auth } from '@/services/node-express-backend/auth';
import RegionValidatedAddressInput from '@/components/RegionValidatedAddressInput';
import { type AddressComponents } from '@/services/google/googlePlacesService';

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
	});

	const [errors, setErrors] = useState({
		firstName: '',
		lastName: '',
		dob: '',
		address: '',
		phone: '',
		email: '',
	});

	const [isAddressValid, setIsAddressValid] = useState(false);

	const handleInputChange = (field: string, value: string) => {
		setForm({ ...form, [field]: value });
		setErrors({ ...errors, [field]: '' });
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
				await Auth.addCriticalInfo(userId, {...form, isPsw: userData!.isPsw});			
				router.push('/onboard1');
			} catch (error) {
				console.error('Error saving user details:', error);
			}
		}
	};

	return (
		<SafeAreaView className="h-full bg-white">
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
				style={{ flex: 1 }}
				keyboardVerticalOffset={0}
			>
				<ScrollView
					contentContainerStyle={{ flexGrow: 1, paddingBottom: 0 }}
					keyboardShouldPersistTaps="handled"
				>
					<View className="flex w-full h-full justify-center px-9">
						<Text className="text-3xl text-black font-normal text-left mb-3">
							Personal Details
						</Text>
						<Text className="text-xs text-gray-500 font-normal text-left mb-4">
							Please fill out the form below with your personal details
						</Text>

						<ForumField
							title="First Name"
							value={form.firstName}
							handleChangeText={(e) => handleInputChange('firstName', e)}
							otherStyles="mb-4"
						/>
						{errors.firstName ? (
							<Text className="text-red-500 text-xs">
								{errors.firstName}
							</Text>
						) : null}

						<ForumField
							title="Last Name"
							value={form.lastName}
							handleChangeText={(e) => handleInputChange('lastName', e)}
							otherStyles="mb-4"
						/>
						{errors.lastName ? (
							<Text className="text-red-500 text-xs">
								{errors.lastName}
							</Text>
						) : null}

						<DatePickerField
							title="Date of Birth"
							value={form.dob}
							onDateChange={(date) => handleInputChange('dob', date)}
							otherStyles="mb-4"
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
							otherStyles="mb-4"
						/>
						{errors.address ? (
							<Text className="text-red-500 text-xs">
								{errors.address}
							</Text>
						) : null}

						<ForumField
							title="Phone"
							value={form.phone}
							handleChangeText={(e) => handleInputChange('phone', e)}
							otherStyles="mb-4"
							keyboardType="phone-pad"
						/>
						{errors.phone ? (
							<Text className="text-red-500 text-xs">
								{errors.phone}
							</Text>
						) : null}

						<ForumField
							title="Email"
							value={form.email}
							handleChangeText={(e) => handleInputChange('email', e)}
							otherStyles="mb-4"
							keyboardType="email-address"
						/>
						{errors.email ? (
							<Text className="text-red-500 text-xs">
								{errors.email}
							</Text>
						) : null}
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
			
			{/* Fixed Continue Button - stays at bottom */}
			<View className="px-9 pb-0">
				<CustomButton
					title="Continue"
					handlePress={handleContinue}
					containerStyles="bg-black py-4 rounded-full"
					textStyles="text-white text-lg"
				/>
			</View>
			<StatusBar backgroundColor="#FFFFFF" style="dark" />
		</SafeAreaView>
	);
};

export default PersonalDetails;
