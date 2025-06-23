// app/_layout.tsx
import React, { useEffect, useRef } from 'react';
import { Stack } from 'expo-router';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StripeProvider } from '@stripe/stripe-react-native';
import { store, RootState, AppDispatch } from '@/redux/store';
import { fetchAvailableUsers } from '@/redux/userListSlice';
import { fetchUserSessionsFromBackend } from '@/redux/sessionSlice';
import { router } from 'expo-router';
import { selectCompletedSessions } from '@/redux/selectors';

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

// Watches Redux for newly-completed sessions and navigates once per session
const SessionCompletionWatcher = () => {
	const completed = useSelector(selectCompletedSessions);
	console.log('completed in GLOBAL', completed);
	const routedIds = useRef<Set<string>>(new Set());

	useEffect(() => {
		const now = Date.now();
		completed.forEach((s) => {
			if (routedIds.current.has(s.id)) return;

			// Only trigger if actualEndTime is within last 30 s (or missing for safety)
			if (!s.actualEndTime) return;

			const endTs = new Date(s.actualEndTime).getTime();
			if (now - endTs <= 30_000) {
				routedIds.current.add(s.id);
				router.push({ pathname: '/(chat)/session-completed', params: { sessionId: s.id } });
			}
		});
	}, [completed]);

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
					{/* GlobalDataLoader preloads global slices; SessionCompletionWatcher handles completion navigation */}
					<GlobalDataLoader />
					<SessionCompletionWatcher />
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
