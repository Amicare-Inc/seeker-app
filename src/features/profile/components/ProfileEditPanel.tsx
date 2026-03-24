// @/components/Profile/ProfileEditPanel.tsx
import React, { useMemo, useState } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Keyboard,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { updateUserFields } from '@/redux/userSlice';
import { User } from '@/types/User';
import GroupedCareTasksDropdown from './GroupedCareTasksDropdown';
import { deriveCareTypesFromTasks } from '@/shared/constants/carePreferencesOnboarding';
import { updateUserProfile } from '@/src/features/currentUser';

interface ProfileEditPanelProps {
	user: User;
}

const ProfileEditPanel: React.FC<ProfileEditPanelProps> = ({ user }) => {
	const dispatch = useDispatch();

	const [bio, setBio] = useState<string>(user.bio || '');
	const [tasksSelection, setTasksSelection] = useState<string[]>(
		user.carePreferences?.tasks || [],
	);

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
	const isAnyChanged = isBioChanged || isCarePrefsChanged;

	const handleConfirmChanges = async () => {
		Keyboard.dismiss();
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

		try {
			const data = await updateUserProfile(user.id!, updatedFields);
			if (data.user) {
				dispatch(updateUserFields(data.user));
			}
		} catch (error) {
			console.error('Error updating profile:', error);
		}
	};

	return (
		<View className="p-4">
			<Text className="text-base font-bold mb-1">Edit Profile</Text>

			<View className="mb-4">
				<Text className="text-sm font-semibold mb-1">Bio</Text>
				<TextInput
					className="border border-gray-300 rounded-lg p-2 text-sm min-h-[60px] text-gray-700"
					value={bio}
					onChangeText={setBio}
					multiline
					placeholder="Enter your bio..."
					textAlignVertical="top"
				/>
			</View>

			<GroupedCareTasksDropdown
				label="Seeking help with"
				initialTasks={tasksSelection}
				onTasksChange={setTasksSelection}
			/>

			{isAnyChanged && (
				<View className="mt-2">
					<Text className="text-xs mb-2">
						Any information provided here may be visible to other users.
					</Text>
					<TouchableOpacity
						onPress={handleConfirmChanges}
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
