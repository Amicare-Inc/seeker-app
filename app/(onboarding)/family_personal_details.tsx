import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ForumField } from '@/shared/components';
import { CustomButton } from '@/shared/components';
import { StatusBar } from 'expo-status-bar';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setTempFamilyMember } from '@/redux/userSlice';
import { router } from 'expo-router';
import { DatePickerField } from '@/shared/components';
import { RegionValidatedAddressInput } from '@/shared/components';
import { type AddressComponents } from '@/services/google/googlePlacesService';

const FamilyPersonalDetails: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const userData = useSelector((state: RootState) => state.user.userData);

	const [form, setForm] = useState({
		firstName: '',
		lastName: '',
		dob: '',
		address: {
			fullAddress: '',
			street: '',
			city: '',
			province: '',
			country: '',
			postalCode: '',
		},
		gender: '',
	});

	const [errors, setErrors] = useState({
		firstName: '',
		lastName: '',
		dob: '',
		address: '',
		gender: '',
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
					<View className="flex w-full h-full justify-center px-9">
						<Text className="text-3xl text-black font-normal text-left mb-3">
							Tell us about your loved one...
						</Text>
						<Text className="text-xs text-gray-500 font-normal text-left mb-4">
							This information helps us find the right caregiver for your family member and ensures proper care coordination.
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
							title="Gender"
							value={form.gender}
							handleChangeText={(e) => handleInputChange('gender', e)}
							otherStyles="mb-4"
						/>
						{errors.gender ? (
							<Text className="text-red-500 text-xs">
								{errors.gender}
							</Text>
						) : null}
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
			
			{/* Fixed Continue Button - stays at bottom */}
			<View className="px-9 pb-4">
				<CustomButton
					title="Continue"
					handlePress={handleContinue}
					containerStyles="bg-black py-4 rounded-lg"
					textStyles="text-white text-lg"
				/>
			</View>
			<StatusBar backgroundColor="#F5F5F5" style="dark" />
		</SafeAreaView>
	);
};

export default FamilyPersonalDetails; 