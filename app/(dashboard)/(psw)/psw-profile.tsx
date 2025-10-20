import React, { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { ProfileScreen } from '@/features/profile';
import { useFocusEffect } from 'expo-router';
import { AuthApi } from '@/features/auth/api/authApi';
import { updateUserFields } from '@/redux/userSlice';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LAYOUT_CONSTANTS } from '@/shared/constants/layout';

const PswProfileScreen = () => {
	const dispatch = useDispatch();
	const currentUser = useSelector((state: RootState) => state.user.userData);
	const [isRefreshing, setIsRefreshing] = useState(false);

	useFocusEffect(
		useCallback(() => {
			let isActive = true;
			(async () => {
				try {
					if (!currentUser?.id) return;
					setIsRefreshing(true);
					const freshUser = await AuthApi.getUser(currentUser.id);
					if (isActive && freshUser) {
						dispatch(updateUserFields(freshUser));
					}
				} catch (e) {
					console.log('Failed to refresh user profile:', e);
				} finally {
					if (isActive) setIsRefreshing(false);
				}
			})();
			return () => { isActive = false; };
		}, [currentUser?.id])
	);

	if (!currentUser) {
		return null;
	}

	return (
		<View style={{ flex: 1, paddingTop: LAYOUT_CONSTANTS.SCREEN_TOP_PADDING }}>
			<ProfileScreen user={currentUser} isMyProfile={true} />
			{isRefreshing && (
				<View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} className="bg-black/10 items-center justify-center">
					<Ionicons name="hourglass" size={36} color="#0c7ae2" />
					<Text className="mt-2 text-blue-600">Refreshing profile...</Text>
				</View>
			)}
		</View>
	);
};

export default PswProfileScreen;
