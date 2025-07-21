// @/components/Profile/ProfileEditPanel.tsx
import React, { useState } from 'react';
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
import OptionsDropdown from './OptionsDropdown';
import helpOptions from '@/assets/helpOptions';
import { updateUserProfile } from '@/src/features/currentUser';

interface ProfileEditPanelProps {
	user: User;
}

const ProfileEditPanel: React.FC<ProfileEditPanelProps> = ({ user }) => {
	const dispatch = useDispatch();

	// Local state for editable fields.
	const [bio, setBio] = useState<string>(user.bio || '');
	const [careTypeSelection, setCareTypeSelection] = useState<string[]>(
		user.carePreferences?.careType || [],
	);
	const [tasksSelection, setTasksSelection] = useState<string[]>(
		user.carePreferences?.tasks || [],
	);

	// Options for dropdowns.
	const careTypeOptions = helpOptions;
	const tasksOptions = helpOptions;

	// Check if any field is changed.
	const isBioChanged = bio !== (user.bio || '');
	const isCareTypeChanged =
		careTypeSelection.join(',') !==
		(user.carePreferences?.careType || []).join(',');
	const isTasksChanged =
		tasksSelection.join(',') !==
		(user.carePreferences?.tasks || []).join(',');
	const isAnyChanged = isBioChanged || isCareTypeChanged || isTasksChanged;

	// Handlers for the dropdowns update local state.
	const handleCareTypeChange = (selected: string) => {
		const newArray = selected.split(',').map((opt) => opt.trim());
		setCareTypeSelection(newArray);
	};

	const handleTasksChange = (selected: string) => {
		const newArray = selected.split(',').map((opt) => opt.trim());
		setTasksSelection(newArray);
	};

	// Confirm button handler: updates all changed fields.
	const handleConfirmChanges = async () => {
		Keyboard.dismiss();
		const updatedFields: any = {};
		if (isBioChanged) {
			updatedFields.bio = bio;
		}
		if (isCareTypeChanged) {
			updatedFields.carePreferences = {
				...user.carePreferences,
				careType: careTypeSelection,
			};
		}
		if (isTasksChanged) {
			updatedFields.carePreferences = {
				...(updatedFields.carePreferences || user.carePreferences),
				tasks: tasksSelection,
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

			{/* Bio Edit Section */}
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

			{/* Dropdown for Care Type */}
			<OptionsDropdown
				label={user.isPsw ? 'Experience with' : 'Requiring'}
				options={careTypeOptions}
				initialValue={careTypeSelection.join(', ')}
				onChange={handleCareTypeChange}
			/>

			{/* Dropdown for Tasks */}
			<OptionsDropdown
				label={user.isPsw ? 'Assisting with' : 'Need Assistance with'}
				options={tasksOptions}
				initialValue={tasksSelection.join(', ')}
				onChange={handleTasksChange}
			/>

			{/* Confirm Changes Button */}
			{isAnyChanged && (
				<View className="mt-2">
					<Text className="text-xs mb-2">Any information provided here may be visible to other users.</Text>
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
