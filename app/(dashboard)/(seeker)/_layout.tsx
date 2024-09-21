import React from 'react'
import { Stack, Tabs } from "expo-router"

const DashboardLayout = () => {
  return (
    <>
      <Tabs
      screenOptions={{tabBarShowLabel: true}}
      >
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

export default DashboardLayout