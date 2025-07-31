// app/_layout.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Stack } from 'expo-router';
import { Provider, useSelector } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StripeProvider } from '@stripe/stripe-react-native';
import { store, RootState } from '@/redux/store';
import { router } from 'expo-router';
import { useSocketListeners } from '@/lib/socket/useSocketListeners';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEnrichedSessions } from '@/features/sessions/api/queries';
import { userDirectoryKeys } from '@/features/userDirectory/api/queries';
import { ActiveSessionProvider } from '@/lib/context/ActiveSessionContext';
import { SessionCompletionProvider } from '@/lib/context/SessionCompletionContext';
import { useQueryClient } from '@tanstack/react-query';
import { onAuthStateChanged, User } from 'firebase/auth';
import { FIREBASE_AUTH } from '@/firebase.config';

const GlobalDataLoader = () => {
	const currentUser = useSelector((state: RootState) => state.user.userData);
	const prevSessionsRef = useRef<string>('');
	const queryClient = useQueryClient();
	const [isAuthReady, setIsAuthReady] = useState(false);
	const [firebaseUser, setFirebaseUser] = useState<User | null>(null);

	// Listen to Firebase auth state changes
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
			console.log('Firebase auth state changed:', user ? user.uid : 'No user');
			setFirebaseUser(user);
			setIsAuthReady(true); // Auth state is now determined
		});

		return unsubscribe;
	}, []);

	// Only proceed with API calls when both Redux user data and Firebase auth are ready
	const shouldMakeApiCalls = isAuthReady && currentUser?.id && firebaseUser;

	// Global socket listeners (will lazily connect when userId available and auth is ready)
	useSocketListeners(shouldMakeApiCalls ? currentUser?.id : undefined);

	// Fetch sessions with React Query - only when everything is ready
	const sessionsQuery = useEnrichedSessions(shouldMakeApiCalls ? currentUser?.id : undefined);

	// Refresh user list when sessions change (someone accepts/declines/etc)
	useEffect(() => {
		if (currentUser && sessionsQuery.data && sessionsQuery.data.length > 0) {
			// Create a hash of session statuses to detect changes
			const sessionHash = sessionsQuery.data.map(s => `${s.id}-${s.status}`).sort().join('|');
			
			if (prevSessionsRef.current && prevSessionsRef.current !== sessionHash) {
				// Sessions have changed, invalidate all user directory queries to refetch
				queryClient.invalidateQueries({ queryKey: userDirectoryKeys.lists() });
			}
			
			prevSessionsRef.current = sessionHash;
		}
	}, [sessionsQuery.data, currentUser, queryClient]);

	return null;
};



const queryClient = new QueryClient();

const LayoutWithProviders = () => {
	return (
		<Provider store={store}>
			<QueryClientProvider client={queryClient}>
				<SessionCompletionProvider>
					<ActiveSessionProvider>
						<SafeAreaProvider>
							<StripeProvider
								publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
								urlScheme="amicare"
								merchantIdentifier="merchant.com.specul8tor.AmiCare"
								>
								{/* GlobalDataLoader preloads global slices; navigation now handled directly in socket listener */}
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
				</ActiveSessionProvider>
			</SessionCompletionProvider>
		</QueryClientProvider>
	</Provider>
);
};

export default function RootLayout() {
	return <LayoutWithProviders />;
}
