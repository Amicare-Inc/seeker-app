import React from 'react'
import { Stack } from "expo-router"

const RootLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="chatPage" options={{headerShown:false}}/>
      <Stack.Screen name="[sessionId]" options={{headerShown:false}}/>
    </Stack>
  )
}

export default RootLayout

