import React, { useCallback, useState } from 'react';
import {
	View,
	Text,
	ScrollView,
	SafeAreaView,
	KeyboardAvoidingView,
	Platform,
	TouchableOpacity,
	ActivityIndicator,
	Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, useFocusEffect } from 'expo-router';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { RootState } from '@/redux/store';
import ProfileEditPanel from '@/features/profile/components/ProfileEditPanel';

const DROPDOWN_TRIGGER =
	'p-4 bg-gray-100 rounded-lg min-h-[48px] justify-center';

const EditProfileScreen = () => {
	const user = useSelector((state: RootState) => state.user.userData);

	const [formKey, setFormKey] = useState(0);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState('');

	useFocusEffect(
		useCallback(() => {
			if (!user?.id) {
				router.back();
				return;
			}
			setError('');
			setFormKey((k) => k + 1);
		}, [user]),
	);

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

						<ProfileEditPanel
							user={user}
							variant="screen"
							formResetKey={formKey}
							careTasksLabel="Seeking help with"
							bioPlaceholder="Introduce yourself to caregivers…"
							footerNote="Personal name and address are edited from Settings → Personal Details."
							dropdownTriggerClassName={DROPDOWN_TRIGGER}
							error={error}
							saving={saving}
							onSaveStart={() => setError('')}
							onSavingChange={setSaving}
							onSaveError={setError}
							onSaveSuccess={() =>
								Alert.alert('Saved', 'Your profile was updated.', [
									{ text: 'OK', onPress: () => router.back() },
								])
							}
						/>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
			<StatusBar style="dark" />
		</SafeAreaView>
	);
};

export default EditProfileScreen;
