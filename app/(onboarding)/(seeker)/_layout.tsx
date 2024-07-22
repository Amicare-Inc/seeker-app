import React from 'react'
import { Stack } from "expo-router"

const SeekerLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="seeker_intro_1" options={{headerShown: false}}/>
      <Stack.Screen name="seeker_intro_2" options={{headerShown: false}}/>
      <Stack.Screen name="seeker_intro_3" options={{headerShown: false}}/>
    </Stack>
  )
}

export default SeekerLayout