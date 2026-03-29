// @/components/Profile/ProfileEditPanel.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Keyboard,
	Image,
	Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch } from 'react-redux';
import { updateUserFields } from '@/redux/userSlice';
import { User } from '@/types/User';
import GroupedCareTasksDropdown from './GroupedCareTasksDropdown';
import { deriveCareTypesFromTasks } from '@/shared/constants/carePreferencesOnboarding';
import { updateUserProfile } from '@/src/features/currentUser';
import { uploadPhotoToFirebase } from '@/services/firebase/storage';
import { CustomButton } from '@/shared/components';

export type ProfileEditPanelProps = {
	user: User;
	/** Full edit screen vs compact card (confirm only when dirty). */
	variant?: 'screen' | 'embedded';
	/** Increment when the screen regains focus to re-sync from `user`. */
	formResetKey?: number;
	careTasksLabel?: string;
	bioPlaceholder: string;
	footerNote: string;
	dropdownTriggerClassName?: string;
	error?: string;
	saving?: boolean;
	onSaveStart?: () => void;
	onSavingChange?: (saving: boolean) => void;
	onSaveSuccess?: () => void;
	onSaveError?: (message: string) => void;
};

const ProfileEditPanel: React.FC<ProfileEditPanelProps> = ({
	user,
	variant = 'embedded',
	formResetKey,
	careTasksLabel,
	bioPlaceholder,
	footerNote,
	dropdownTriggerClassName,
	error,
	saving = false,
	onSaveStart,
	onSavingChange,
	onSaveSuccess,
	onSaveError,
}) => {
	const dispatch = useDispatch();
	const isScreen = variant === 'screen';

	const [bio, setBio] = useState<string>(user.bio || '');
	const [tasksSelection, setTasksSelection] = useState<string[]>(
		user.carePreferences?.tasks || [],
	);
	const [pendingPhotoUri, setPendingPhotoUri] = useState<string | null>(null);

	const tasksLabel =
		careTasksLabel ??
		(user.isPsw ? 'Assisting with' : 'Seeking help with');

	useEffect(() => {
		setBio(user.bio || '');
		setTasksSelection(user.carePreferences?.tasks || []);
		setPendingPhotoUri(null);
	}, [
		user.id,
		user.profilePhotoUrl,
		user.bio,
		user.carePreferences?.tasks?.join('\u0001'),
		formResetKey,
	]);

	const derivedCareTypes = useMemo(
		() => deriveCareTypesFromTasks(tasksSelection),
		[tasksSelection],
	);

	const isBioChanged = bio !== (user.bio || '');
	const storedTasks = user.carePreferences?.tasks || [];
	const storedTypes = user.carePreferences?.careType || [];
	const isCarePrefsChanged =
		tasksSelection.join('\u0001') !== storedTasks.join('\u0001') ||
		derivedCareTypes.join('\u0001') !== storedTypes.join('\u0001');
	const isPhotoChanged = pendingPhotoUri !== null;
	const isDirty = isBioChanged || isCarePrefsChanged || isPhotoChanged;

	const handlePickPhoto = async () => {
		if (saving) return;
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== 'granted') {
			Alert.alert(
				'Permission needed',
				'Allow photo library access to update your profile picture.',
			);
			return;
		}
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.85,
		});
		if (!result.canceled) {
			setPendingPhotoUri(result.assets[0].uri);
		}
	};

	const handleSave = async () => {
		if (!user.id || !isDirty) return;
		Keyboard.dismiss();
		onSaveStart?.();
		onSavingChange?.(true);
		try {
			const updatedFields: Record<string, unknown> = {};
			if (isBioChanged) {
				updatedFields.bio = bio;
			}
			if (isCarePrefsChanged) {
				updatedFields.carePreferences = {
					...user.carePreferences,
					tasks: tasksSelection,
					careType: derivedCareTypes,
				};
			}
			if (pendingPhotoUri) {
				const url = await uploadPhotoToFirebase(user.id, pendingPhotoUri);
				updatedFields.profilePhotoUrl = url;
			}

			const data = await updateUserProfile(user.id, updatedFields);
			if (data.user) {
				dispatch(updateUserFields(data.user));
			}
			if (isScreen) {
				onSaveSuccess?.();
			}
		} catch (e: unknown) {
			const message =
				e instanceof Error ? e.message : 'Could not save. Try again.';
			if (isScreen) {
				onSaveError?.(message);
			} else {
				console.error('Error updating profile:', e);
			}
		} finally {
			onSavingChange?.(false);
		}
	};

	const photoSize = isScreen ? 112 : 96;
	const photoRadius = isScreen ? 56 : 48;

	const photoBlock = (
		<>
			<Text
				className={
					isScreen
						? 'text-xs text-gray-500 font-normal mb-2'
						: 'text-sm font-semibold mb-2 self-start w-full'
				}
			>
				Profile photo
			</Text>
			<View className={isScreen ? 'items-center mb-6' : 'mb-4 items-center'}>
				<TouchableOpacity
					onPress={handlePickPhoto}
					disabled={saving}
					activeOpacity={0.8}
					className="items-center"
				>
					<Image
						source={
							pendingPhotoUri
								? { uri: pendingPhotoUri }
								: user.profilePhotoUrl
									? { uri: user.profilePhotoUrl }
									: require('@/assets/default-profile.png')
						}
						style={{
							width: photoSize,
							height: photoSize,
							borderRadius: photoRadius,
						}}
						className="bg-gray-200"
					/>
					<Text className="text-sm font-semibold text-[#0c7ae2] mt-3">
						Change photo
					</Text>
				</TouchableOpacity>
			</View>
		</>
	);

	const bioBlock = (
		<>
			<Text
				className={
					isScreen
						? 'text-xs text-gray-500 font-normal mb-2'
						: 'text-sm font-semibold mb-1'
				}
			>
				Bio
			</Text>
			<TextInput
				className={
					isScreen
						? 'bg-gray-100 rounded-lg px-4 py-3 text-base text-black font-medium min-h-[120px] mb-6'
						: 'border border-gray-300 rounded-lg p-2 text-sm min-h-[60px] text-gray-700 mb-4'
				}
				value={bio}
				onChangeText={setBio}
				multiline
				placeholder={bioPlaceholder}
				placeholderTextColor={isScreen ? '#9D9DA1' : undefined}
				textAlignVertical="top"
				editable={!saving}
			/>
		</>
	);

	const tasksBlock = (
		<GroupedCareTasksDropdown
			key={`care-tasks-${formResetKey ?? 0}-${tasksLabel}`}
			label={tasksLabel}
			initialTasks={tasksSelection}
			onTasksChange={setTasksSelection}
			triggerClassName={dropdownTriggerClassName}
		/>
	);

	const footerBlock = (
		<Text
			className={
				isScreen
					? 'text-xs text-gray-400 font-normal mb-4'
					: 'text-xs mb-2'
			}
		>
			{footerNote}
		</Text>
	);

	if (isScreen) {
		return (
			<>
				{error ? (
					<View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
						<Text className="text-red-700 text-sm text-center">{error}</Text>
					</View>
				) : null}

				{photoBlock}
				{bioBlock}
				{tasksBlock}
				{footerBlock}
				<CustomButton
					title="Save changes"
					handlePress={handleSave}
					containerStyles={`mb-4 ${!isDirty || saving ? 'opacity-40' : ''}`}
				/>
			</>
		);
	}

	return (
		<View className="p-4">
			<Text className="text-base font-bold mb-1">Edit Profile</Text>

			{photoBlock}
			{bioBlock}
			{tasksBlock}
			{footerBlock}

			{isDirty && (
				<View className="mt-2">
					<Text className="text-xs mb-2">
						Any information provided here may be visible to other users.
					</Text>
					<TouchableOpacity
						onPress={handleSave}
						className=" bg-brand-blue rounded-lg py-2 px-4 self-start mt-2"
					>
						<Text className="text-sm font-semibold text-white">
							Confirm Changes
						</Text>
					</TouchableOpacity>
				</View>
			)}
		</View>
	);
};

export default ProfileEditPanel;
