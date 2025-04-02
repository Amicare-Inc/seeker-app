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
			<Stack.Screen name="onboard1" options={{ headerShown: false }} />
			<Stack.Screen name="tasks" options={{ headerShown: false }} />
			<Stack.Screen
				name="availability"
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="add_profile_photo"
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
			<Stack.Screen name="(seeker)" options={{ headerShown: false }} />
			<Stack.Screen name="(psw)" options={{ headerShown: false }} />
		</Stack>
	);
};

export default OnboardingLayout;
