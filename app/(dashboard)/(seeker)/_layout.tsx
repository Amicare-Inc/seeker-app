import React from 'react'
import { Stack, Tabs } from "expo-router"
import { Ionicons } from '@expo/vector-icons';

const SeekerDashboardLayout = () => {
  return (
    <>
      <Tabs screenOptions={({ route }) => ({
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#008DF4",  // Active tint color
        tabBarInactiveTintColor: "#999",    // Inactive tint color
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: React.ComponentProps<typeof Ionicons>['name'] = "home";
          if (route.name === 'seeker-home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'seeker-sessions') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'seeker-profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}>
        <Tabs.Screen
          name="seeker-home"
          options={{
            title: "Home",
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="seeker-sessions"
          options={{
            title: "Sessions",
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="seeker-profile"
          options={{
            title: "My Profile",
            headerShown: false,
          }}
        />
      </Tabs>
    </>
  )
}

export default SeekerDashboardLayout