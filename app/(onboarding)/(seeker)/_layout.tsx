import React from 'react'
import { Stack } from "expo-router"

const SeekerLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="seeker_intro_1" options={{headerShown: false}}/>
    </Stack>
  )
}

export default SeekerLayout