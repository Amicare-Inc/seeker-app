import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
	View,
	Text,
	ScrollView,
	SafeAreaView,
	KeyboardAvoidingView,
	Platform,
	TouchableOpacity,
	TextInput,
	ActivityIndicator,
	Alert,
	Keyboard,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, useFocusEffect } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { RootState } from '@/redux/store';
import { updateUserFields } from '@/redux/userSlice';
import { CustomButton } from '@/shared/components';
import OptionsDropdown from '@/features/profile/components/OptionsDropdown';
import {
	CARE_TYPE_OPTIONS,
	getTaskOptionsForCareTypes,
} from '@/shared/constants/carePreferencesOnboarding';
import { updateUserProfile } from '@/src/features/currentUser';

const DROPDOWN_TRIGGER =
	'p-4 bg-gray-100 rounded-lg min-h-[48px] justify-center';

const EditProfileScreen = () => {
	const dispatch = useDispatch();
	const user = useSelector((state: RootState) => state.user.userData);

	const [formKey, setFormKey] = useState(0);
	const [bio, setBio] = useState('');
	const [careTypeSelection, setCareTypeSelection] = useState<string[]>([]);
	const [tasksSelection, setTasksSelection] = useState<string[]>([]);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState('');

	useFocusEffect(
		useCallback(() => {
			if (!user?.id) {
				router.back();
				return;
			}
			setBio(user.bio || '');
			setCareTypeSelection(user.carePreferences?.careType || []);
			setTasksSelection(user.carePreferences?.tasks || []);
			setError('');
			setFormKey((k) => k + 1);
		}, [user]),
	);

	const allowedCareTypes = useMemo(() => new Set(CARE_TYPE_OPTIONS), []);

	const taskDropdownOptions = useMemo(
		() => getTaskOptionsForCareTypes(careTypeSelection),
		[careTypeSelection],
	);

	// Drop tasks that are no longer valid for the selected care categories (matches signup).
	useEffect(() => {
		const allowed = new Set(getTaskOptionsForCareTypes(careTypeSelection));
		setTasksSelection((prev) => prev.filter((t) => allowed.has(t)));
	}, [careTypeSelection]);

	const handleCareTypeChange = (selected: string) => {
		const next = selected
			.split(',')
			.map((opt) => opt.trim())
			.filter(Boolean)
			.filter((opt) => allowedCareTypes.has(opt));
		setCareTypeSelection(next);
	};

	const handleTasksChange = (selected: string) => {
		const next = selected
			.split(',')
			.map((opt) => opt.trim())
			.filter(Boolean);
		setTasksSelection(next);
	};

	const isBioChanged = bio !== (user?.bio || '');
	const isCareTypeChanged =
		careTypeSelection.join(',') !==
		(user?.carePreferences?.careType || []).join(',');
	const isTasksChanged =
		tasksSelection.join(',') !==
		(user?.carePreferences?.tasks || []).join(',');
	const isDirty = isBioChanged || isCareTypeChanged || isTasksChanged;

	const handleSave = async () => {
		if (!user?.id || !isDirty) return;
		Keyboard.dismiss();
		setError('');
		setSaving(true);
		try {
			const updatedFields: Record<string, unknown> = {};
			if (isBioChanged) updatedFields.bio = bio;
			if (isCareTypeChanged) {
				updatedFields.carePreferences = {
					...user.carePreferences,
					careType: careTypeSelection,
				};
			}
			if (isTasksChanged) {
				updatedFields.carePreferences = {
					...(updatedFields.carePreferences as object | undefined) ||
						user.carePreferences,
					tasks: tasksSelection,
				};
			}

			const data = await updateUserProfile(user.id, updatedFields);
			if (data.user) {
				dispatch(updateUserFields(data.user));
			}
			Alert.alert('Saved', 'Your profile was updated.', [
				{ text: 'OK', onPress: () => router.back() },
			]);
		} catch (e: unknown) {
			const message =
				e instanceof Error ? e.message : 'Could not save. Try again.';
			setError(message);
		} finally {
			setSaving(false);
		}
	};

	if (!user?.id) {
		return null;
	}

	return (
		<SafeAreaView className="flex-1 bg-white">
			{saving && (
				<View className="absolute top-0 left-0 right-0 bottom-0 bg-grey-0 z-50 items-center justify-center">
					<View className="bg-white rounded-lg p-6 items-center">
						<ActivityIndicator size="large" color="#000" />
						<Text className="text-black text-lg font-medium mt-3">
							Saving…
						</Text>
					</View>
				</View>
			)}

			<KeyboardAvoidingView
				className="flex-1"
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
			>
				<ScrollView
					className="flex-1"
					contentContainerStyle={{ paddingBottom: 32 }}
					keyboardShouldPersistTaps="handled"
					showsVerticalScrollIndicator={false}
				>
					<View className="px-9 pt-2 pb-6">
						<View className="flex-row items-center mb-6">
							<TouchableOpacity
								onPress={() => router.back()}
								className="p-2 -ml-2 mr-2"
								hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
								disabled={saving}
							>
								<Ionicons name="chevron-back" size={26} color="#000" />
							</TouchableOpacity>
							<Text className="text-lg font-medium text-black flex-1">
								Edit profile
							</Text>
						</View>

						<Text className="text-3xl text-black font-normal text-left mb-2">
							Update your profile
						</Text>
						<Text className="text-xs text-gray-500 font-normal text-left mb-6 leading-5">
							Everything on this page is in one place—adjust your bio and care
							preferences, then save. Some details may be visible to other users.
						</Text>

						{error ? (
							<View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
								<Text className="text-red-700 text-sm text-center">
									{error}
								</Text>
							</View>
						) : null}

						<Text className="text-xs text-gray-500 font-normal mb-2">Bio</Text>
						<TextInput
							className="bg-gray-100 rounded-lg px-4 py-3 text-base text-black font-medium min-h-[120px] mb-6"
							value={bio}
							onChangeText={setBio}
							multiline
							placeholder="Introduce yourself to caregivers…"
							placeholderTextColor="#9D9DA1"
							textAlignVertical="top"
							editable={!saving}
						/>

						<OptionsDropdown
							key={`care-${formKey}`}
							label="Requiring help with"
							options={CARE_TYPE_OPTIONS}
							initialValue={careTypeSelection.join(', ')}
							onChange={handleCareTypeChange}
							triggerClassName={DROPDOWN_TRIGGER}
						/>

						<OptionsDropdown
							key={`tasks-${formKey}-${careTypeSelection.slice().sort().join('|')}`}
							label="Seeking support with"
							options={taskDropdownOptions}
							initialValue={tasksSelection.join(', ')}
							onChange={handleTasksChange}
							triggerClassName={DROPDOWN_TRIGGER}
						/>

						<Text className="text-xs text-gray-400 font-normal mb-4">
							Personal name and address are edited from Settings → Personal
							Details.
						</Text>

						<CustomButton
							title="Save changes"
							handlePress={handleSave}
							containerStyles={`mb-4 ${!isDirty || saving ? 'opacity-40' : ''}`}
						/>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
			<StatusBar style="dark" />
		</SafeAreaView>
	);
};

export default EditProfileScreen;
