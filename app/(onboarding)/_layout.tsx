import React from 'react'
import { Stack } from "expo-router"

const OnboardingLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="role" options={{headerShown:false}}/>
      <Stack.Screen name="personal_details" options={{headerShown:false}}/>
    </Stack>
  )
}

export default OnboardingLayout