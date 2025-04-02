import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const PswDashboardLayout = () => {
	return (
		<>
			<Tabs
				screenOptions={({ route }) => ({
					tabBarShowLabel: true,
					tabBarActiveTintColor: '#008DF4', // Active tint color
					tabBarInactiveTintColor: '#999', // Inactive tint color
					tabBarIcon: ({ focused, color, size }) => {
						let iconName: React.ComponentProps<
							typeof Ionicons
						>['name'] = 'home';
						if (route.name === 'psw-home') {
							iconName = focused ? 'home' : 'home-outline';
						} else if (route.name === 'psw-sessions') {
							iconName = focused ? 'time' : 'time-outline';
						} else if (route.name === 'psw-profile') {
							iconName = focused ? 'person' : 'person-outline';
						}
						return (
							<Ionicons
								name={iconName}
								size={size}
								color={color}
							/>
						);
					},
				})}
			>
				<Tabs.Screen
					name="psw-home"
					options={{
						title: 'Home',
						headerShown: false,
					}}
				/>
				<Tabs.Screen
					name="psw-sessions"
					options={{
						title: 'Sessions',
						headerShown: false,
					}}
				/>
				<Tabs.Screen
					name="psw-profile"
					options={{
						title: 'My Profile',
						headerShown: false,
					}}
				/>
			</Tabs>
		</>
	);
};

export default PswDashboardLayout;
