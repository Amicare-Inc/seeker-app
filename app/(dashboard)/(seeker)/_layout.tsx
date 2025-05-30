import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLiveSession } from '@/hooks/useLiveSession';
import { View } from 'react-native';
import LiveSessionCard from '@/components/LiveSessionCard';

const SeekerDashboardLayout = () => {
	const activeLiveSession = useLiveSession();
	return (
		<View style={{ flex: 1 }}>
			<Tabs
				screenOptions={({ route }) => ({
					tabBarShowLabel: true,
					tabBarActiveTintColor: '#008DF4', // Active tint color
					tabBarInactiveTintColor: '#999', // Inactive tint color
					tabBarStyle: {
						position: 'relative',  // Make tab bar position relative
						zIndex: 2,  // Higher than content, lower than LiveSessionCard
					},
					tabBarIcon: ({ focused, color, size }) => {
						let iconName: React.ComponentProps<
							typeof Ionicons
						>['name'] = 'home';
						if (route.name === 'seeker-home') {
							iconName = focused ? 'home' : 'home-outline';
						} else if (route.name === 'seeker-sessions') {
							iconName = focused ? 'time' : 'time-outline';
						} else if (route.name === 'seeker-profile') {
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
					name="seeker-home"
					options={{
						title: 'Home',
						headerShown: false,
					}}
				/>
				<Tabs.Screen
					name="seeker-sessions"
					options={{
						title: 'Sessions',
						headerShown: false,
					}}
				/>
				<Tabs.Screen
					name="seeker-profile"
					options={{
						title: 'My Profile',
						headerShown: false,
					}}
				/>
			</Tabs>
			{activeLiveSession && (
				<View 
					style={{
						position: 'absolute',
						bottom: 0,
						left: 0,
						right: 0,
						zIndex: 1,  // Lower than tab bar
						marginBottom: 49, // Height of tab bar
					}}
					pointerEvents="box-none"
				>
					<LiveSessionCard
						session={activeLiveSession}
						onExpand={() => console.log('expanded')}
						onCollapse={() => console.log('collapsed')}
					/>
				</View>
			)}
		</View>
	);
};

export default SeekerDashboardLayout;
