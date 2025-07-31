import React from 'react';
import { Stack } from 'expo-router';

const OnboardingLayout = () => {
	return (
		<Stack>
			<Stack.Screen name="role" options={{ headerShown: false }} />
			<Stack.Screen
				name="personal_details"
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="verification_prompt"
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="verification_webview"
				options={{ headerShown: false }}
			/>
			<Stack.Screen name="bio_screen" options={{ headerShown: false }} />
			<Stack.Screen name="care_needs_1" options={{ headerShown: false }} />
			<Stack.Screen name="care_needs_2" options={{ headerShown: false }} />
			<Stack.Screen name="care_needs_selection" options={{ headerShown: false }} />
			<Stack.Screen name="care_schedule" options={{ headerShown: false }} />
			<Stack.Screen name="caregiver_preferences" options={{ headerShown: false }} />
			<Stack.Screen name="profile_details" options={{ headerShown: false }} />
			<Stack.Screen name="about_loved_one" options={{ headerShown: false }} />
			<Stack.Screen name="family_personal_details" options={{ headerShown: false }} />
			<Stack.Screen name="loved_one_relationship" options={{ headerShown: false }} />
			<Stack.Screen name="family_profile_details" options={{ headerShown: false }} />
			<Stack.Screen name="stripe-onboarding" options={{ headerShown: false }} />
			<Stack.Screen name="stripe-success" options={{ headerShown: false }} />
			<Stack.Screen name="(seeker)" options={{ headerShown: false }} />
			<Stack.Screen name="(psw)" options={{ headerShown: false }} />
		</Stack>
	);
};

export default OnboardingLayout;
