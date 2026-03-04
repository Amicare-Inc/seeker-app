import React from 'react';
import { Stack } from 'expo-router';

const RootLayout = () => {
	return (
		<Stack>
			<Stack.Screen name="chatPage" options={{ headerShown: false }} />
			<Stack.Screen name="[sessionId]" options={{ headerShown: false }} />
			<Stack.Screen name="admin-chat" options={{ headerShown: false }} />
			<Stack.Screen
				name="session-confirmation"
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="session-completed"
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="session-confirmation-2"
				options={{ headerShown: false }}
			/>
		</Stack>
	);
};

export default RootLayout;
