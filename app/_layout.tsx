// app/_layout.tsx
import React, { useEffect, useRef } from 'react';
import { Stack } from 'expo-router';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StripeProvider } from '@stripe/stripe-react-native';
import { store, RootState, AppDispatch } from '@/redux/store';
import { fetchAvailableUsers } from '@/redux/userListSlice';
import { fetchUserSessionsFromBackend } from '@/redux/sessionSlice';

const GlobalDataLoader = () => {
	const dispatch = useDispatch<AppDispatch>();
	const currentUser = useSelector((state: RootState) => state.user.userData);
	const sessions = useSelector((state: RootState) => state.sessions.allSessions);
	const prevSessionsRef = useRef<string>('');

	// Initial data loading
	useEffect(() => {
		if (currentUser && currentUser.id) {
			dispatch(fetchUserSessionsFromBackend(currentUser.id));
			dispatch(fetchAvailableUsers({ isPsw: !currentUser.isPsw }));
		}
	}, [currentUser, dispatch]);

	// Refresh user list when sessions change (someone accepts/declines/etc)
	useEffect(() => {
		if (currentUser && sessions.length > 0) {
			// Create a hash of session statuses to detect changes
			const sessionHash = sessions.map(s => `${s.id}-${s.status}`).sort().join('|');
			
			if (prevSessionsRef.current && prevSessionsRef.current !== sessionHash) {
				// Sessions have changed, refresh user list
				dispatch(fetchAvailableUsers({ isPsw: !currentUser.isPsw }));
			}
			
			prevSessionsRef.current = sessionHash;
		}
	}, [sessions, currentUser, dispatch]);

	return null;
};

const LayoutWithProviders = () => {
	return (
		<Provider store={store}>
			<SafeAreaProvider>
				<StripeProvider
					publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
					urlScheme="amicare"
					merchantIdentifier="merchant.com.specul8tor.AmiCare"
					>
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
				</StripeProvider>
			</SafeAreaProvider>
		</Provider>
	);
};

export default function RootLayout() {
	return <LayoutWithProviders />;
}
