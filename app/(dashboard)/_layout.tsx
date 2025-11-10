import React from 'react';
import { Stack } from 'expo-router';

const OnboardingLayout = () => {
	return (
		<Stack>
			<Stack.Screen name="(seeker)" options={{ headerShown: false }} />
			<Stack.Screen name="(psw)" options={{ headerShown: false }} />
			<Stack.Screen
				name="request-sessions"
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="sent-request"
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="other-user-profile"
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="session-application"
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="application-sent"
				options={{ headerShown: false }}
			/>
		</Stack>
	);
};

export default OnboardingLayout;
