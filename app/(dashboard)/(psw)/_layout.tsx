import React from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLiveSession } from '@/features/sessions';
import { LiveSessionCard } from '@/features/sessions';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const PswDashboardLayout = () => {
	const activeLiveSession = useLiveSession();

	return (
		<SafeAreaProvider >
			<View style={{ flex: 1 }} >
				<Tabs
					screenOptions={({ route }) => ({
						tabBarShowLabel: true,
						tabBarActiveTintColor: '#000', // Active tint color
						tabBarInactiveTintColor: '#7B7B7E', // Inactive tint color
						tabBarStyle: {
							height: Platform.OS === 'ios' ? 83 : 64,
							paddingBottom: Platform.OS === 'ios' ? 30 : 12,
							paddingTop: 12,
							backgroundColor: '#F2F2F7',
							borderTopWidth: 1,
							borderTopColor: "#79797966",
							elevation: 0,
							shadowOpacity: 0,
							position: 'absolute',
							bottom: 0,
							left: 0,
							right: 0,
						},
						tabBarIcon: ({ focused, color, size }) => {
							let iconName: React.ComponentProps<
								typeof Ionicons
							>['name'] = 'home';
							if (route.name === 'psw-home') {
								iconName = 'home';
							} else if (route.name === 'psw-sessions') {
								iconName = 'time';
							} else if (route.name === 'psw-profile') {
								iconName =  'person';
							}
							return (
								<Ionicons
									name={iconName}
									size={22}
									color={color}
									style={{ marginBottom: 8 }}
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
				{activeLiveSession && (
					<KeyboardAvoidingView 
						style={{
							position: 'absolute',
							bottom: Platform.OS === 'ios' ? 83 : 64,
							left: 0,
							right: 0,
							zIndex: 1,
						}}
						behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
						pointerEvents="box-none"
					>
						<LiveSessionCard
							session={activeLiveSession}
							onExpand={() => console.log('expanded')}
							onCollapse={() => console.log('collapsed')}
						/>
					</KeyboardAvoidingView>
				)}
			</View>
		</SafeAreaProvider>
	);
};

export default PswDashboardLayout;
