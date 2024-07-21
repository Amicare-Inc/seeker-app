import React from 'react'
import { Stack } from "expo-router"

const SeekerLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="psw_intro_1" options={{headerShown: false}}/>
    </Stack>
  )
}

export default SeekerLayout