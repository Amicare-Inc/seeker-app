import React from 'react'
import { Stack, Tabs } from "expo-router"

const PswDashboardLayout = () => {
  return (
    <>
      <Tabs
      screenOptions={{tabBarShowLabel: true}}
      >
        <Tabs.Screen
          name="psw-home"
          options={{
            title: "Home",
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="psw-sessions"
          options={{
            title: "Sessions",
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="psw-profile"
          options={{
            title: "My Profile",
            headerShown: false,
          }}
        />
      </Tabs>
    </>
  )
}

export default PswDashboardLayout