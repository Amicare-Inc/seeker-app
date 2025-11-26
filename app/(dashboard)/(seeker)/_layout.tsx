import React from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLiveSession } from '@/features/sessions';
import { LiveSessionCard } from '@/features/sessions';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LAYOUT_CONSTANTS } from '@/shared/constants/layout';

const SeekerDashboardLayout = () => {
	const activeLiveSession = useLiveSession();

	return (
		<SafeAreaProvider>
			<View style={{ flex: 1 }}>
			<Tabs
					initialRouteName="seeker-sessions"
					screenOptions={({ route }) => ({
						tabBarShowLabel: true,
						tabBarActiveTintColor: '#000',
						tabBarInactiveTintColor: '#7B7B7E',
						tabBarStyle: {
							height: LAYOUT_CONSTANTS.TAB_BAR_HEIGHT,
							paddingBottom: LAYOUT_CONSTANTS.TAB_BAR_PADDING_BOTTOM,
							paddingTop: LAYOUT_CONSTANTS.TAB_BAR_PADDING_TOP,
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
							>['name'] = 'time';
							if (route.name === 'seeker-sessions') {
								iconName = 'time';
							} else if (route.name === 'seeker-profile') {
								iconName = 'person';
							}
							else if (route.name === 'seeker-meetups') {
								iconName = 'people';
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
						name="seeker-meetups"
						options={{
							title: 'Meetups',
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
					<KeyboardAvoidingView 
						style={{
							position: 'absolute',
							bottom: LAYOUT_CONSTANTS.TAB_BAR_HEIGHT + LAYOUT_CONSTANTS.LIVE_SESSION_CARD_SPACING,
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

export default SeekerDashboardLayout;