// app/_layout.tsx
import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, Platform, AppState } from 'react-native';
import { Stack } from 'expo-router';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StripeProvider } from '@stripe/stripe-react-native';
import { store, RootState } from '@/redux/store';
import { router } from 'expo-router';
import { useSocketListeners } from '@/lib/socket/useSocketListeners';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { useEnrichedSessions } from '@/features/sessions/api/queries';
import { userDirectoryKeys } from '@/features/userDirectory/api/queries';
import { ActiveSessionProvider } from '@/lib/context/ActiveSessionContext';
import { SessionCompletionProvider } from '@/lib/context/SessionCompletionContext';
import { onAuthStateChanged, User } from 'firebase/auth';
import { FIREBASE_AUTH } from '@/firebase.config';
import { AuthApi } from '@/features/auth/api/authApi';
import { fetchExploreUsersWithDistance } from '@/features/userDirectory/api/userDirectoryApi';
import { getUserSessionTab } from '@/features/sessions/api/sessionApi'
import { updateUserFields } from '@/redux/userSlice';
import { useUnreadSetup } from '@/features/chat/unread/useUnread';

const GlobalDataLoader = () => {
	const dispatch = useDispatch();
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

	// Initialize unread storage mapping after auth/user ready
	useUnreadSetup();

	// Fetch sessions with React Query - only when everything is ready
	const sessionsQuery = useEnrichedSessions(shouldMakeApiCalls ? currentUser?.id : undefined);

	// Helper to refresh and also push fresh user into Redux
	const refreshAll = React.useCallback(() => {
		if (!shouldMakeApiCalls || !currentUser?.id) return Promise.resolve();
		const uid = currentUser.id as string;
		const userType = 'seeker';
		return Promise.all([
			(async () => {
				try {
					const fresh = await AuthApi.getUser(uid);
					if (fresh) {
						dispatch(updateUserFields(fresh));
						queryClient.setQueryData(['user', uid], fresh);
					}
				} catch {}
			})(),
			queryClient.prefetchQuery({
				queryKey: userDirectoryKeys.withDistance(userType, uid),
				queryFn: () => fetchExploreUsersWithDistance(userType as 'psw' | 'seeker', uid),
				staleTime: 180_000,
			}),
			queryClient.prefetchQuery({
				queryKey: ['sessions', 'list', uid],
				queryFn: () => getUserSessionTab(uid),
				staleTime: 15_000,
			}),
		]).then(() => undefined);
	}, [shouldMakeApiCalls, currentUser?.id, false, queryClient, dispatch]);

	// Background prefetch on app foreground
	useEffect(() => {
		if (!shouldMakeApiCalls || !currentUser?.id) return;
		refreshAll(); // Run on mount
		const sub = AppState.addEventListener('change', (s) => { if (s === 'active') refreshAll(); });
		return () => sub.remove();
	}, [shouldMakeApiCalls, currentUser?.id, false, queryClient, refreshAll]);

	// Add a 30s background refresh while app is running
	useEffect(() => {
		if (!shouldMakeApiCalls || !currentUser?.id) return;
		const interval = setInterval(() => {
			refreshAll();
		}, 30_000);
		return () => clearInterval(interval);
	}, [shouldMakeApiCalls, currentUser?.id, false, refreshAll]);

	// Refresh user list when sessions change (someone accepts/declines/etc)
	useEffect(() => {
		if (currentUser && sessionsQuery.data && sessionsQuery.data.length > 0) {
			// Create a hash of session statuses to detect changes
			const sessionHash = sessionsQuery.data.map(s => `${s.id}-${s.status}`).sort().join('|');
			
			if (prevSessionsRef.current && prevSessionsRef.current !== sessionHash) {
				// Sessions have changed, invalidate all user directory queries to refetch
				queryClient.invalidateQueries({ queryKey: userDirectoryKeys.lists() as any });
			}
			
			prevSessionsRef.current = sessionHash;
		}
	}, [sessionsQuery.data, currentUser, queryClient]);

	return null;
};



const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Conservative defaults; specific queries get custom staleTime via prefetch or setQueryDefaults
      staleTime: 60_000,
      gcTime: 600_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});


const LayoutWithProviders = () => {
  // Block hardware back button on Android
  useEffect(() => {
	if (Platform.OS === 'android') {
	  const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
	  return () => backHandler.remove();
	}
  }, []);

  return (
	<Provider store={store}>
	  <QueryClientProvider client={queryClient}>
		<SessionCompletionProvider>
		  <ActiveSessionProvider>
			<SafeAreaProvider>
			  <StripeProvider
				publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
				urlScheme="amicare"
				// merchantIdentifier="merchant.com.specul8tor.AmiCare" // Commented out - remove Apple Pay
			  >
				{/* GlobalDataLoader preloads global slices; navigation now handled directly in socket listener */}
				<GlobalDataLoader />
				<Stack screenOptions={{ gestureEnabled: false }}>
				  <Stack.Screen name="index" options={{ headerShown: false }} />
				  <Stack.Screen name="lock" options={{ headerShown: false }} />
				  <Stack.Screen name="(auth)" options={{ headerShown: false }} />
				  <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
				  <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
				  <Stack.Screen name="(chat)" options={{ headerShown: false }} />
				  <Stack.Screen name="(profile)" options={{ headerShown: false }} />
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
