// app/_layout.tsx
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store, RootState, AppDispatch } from '@/redux/store';
import { fetchAvailableUsers } from '@/redux/userListSlice';
import { fetchUserSessionsFromBackend } from '@/redux/sessionSlice';

const GlobalDataLoader = () => {
	const dispatch = useDispatch<AppDispatch>();
	const currentUser = useSelector((state: RootState) => state.user.userData);

	useEffect(() => {
		if (currentUser && currentUser.id) {
			dispatch(fetchUserSessionsFromBackend(currentUser.id));// unsubscribe = listenToUserSessions(dispatch, currentUser.id);
			dispatch(fetchAvailableUsers({ isPsw: !currentUser.isPsw }));
		}
	}, [currentUser, dispatch]);

	return null;
};

const LayoutWithProviders = () => {
	return (
		<Provider store={store}>
			<SafeAreaProvider>
				{/* GlobalDataLoader preloads global slices (user list and sessions) as soon as the user is available */}
				<GlobalDataLoader />
				<Stack>
					<Stack.Screen
						name="index"
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="lock"
						options={{ headerShown: false, gestureEnabled: false }}
					/>
					<Stack.Screen
						name="(auth)"
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="(dashboard)"
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="(onboarding)"
						options={{ headerShown: false, gestureEnabled: false }}
					/>
					<Stack.Screen
						name="(chat)"
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="(profile)"
						options={{ headerShown: false }}
					/>
				</Stack>
			</SafeAreaProvider>
		</Provider>
	);
};

export default function RootLayout() {
	return (
		<Provider store={store}>
			<LayoutWithProviders />
		</Provider>
	);
}
