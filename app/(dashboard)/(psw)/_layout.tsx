import React from 'react';
import { View, Platform, KeyboardAvoidingView, Dimensions } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLiveSession } from '@/features/sessions';
import { LiveSessionCard } from '@/features/sessions';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const PswDashboardLayout = () => {
	const activeLiveSession = useLiveSession();
	const windowHeight = Dimensions.get('window').height;
	const screenHeight = Dimensions.get('screen').height;
	// Calculate bottom padding based on navigation bar height
	const navBarHeight = screenHeight - windowHeight;
					const tabBarHeight = Platform.OS === 'ios' ? 60 : 52;
					const dynamicBottom = Platform.OS === 'ios' ? 8 : 5 //Math.max(32, navBarHeight);

	return (
		<SafeAreaProvider >
			<View style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 32 : 0, paddingBottom: dynamicBottom}} >
			<Tabs
					screenOptions={({ route }) => ({
						tabBarShowLabel: true,
						tabBarActiveTintColor: '#000', // Active tint color
						tabBarInactiveTintColor: '#7B7B7E', // Inactive tint color
								tabBarStyle: {
									height: Platform.OS === 'ios' ? 83 : 52,
									paddingBottom: Platform.OS === 'ios' ? 8 : 8,
									paddingTop: 8,
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
													bottom: Platform.OS === 'ios' ? tabBarHeight + dynamicBottom + 13 : tabBarHeight + dynamicBottom,
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
