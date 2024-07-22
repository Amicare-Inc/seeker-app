import React from 'react'
import { Stack } from "expo-router"

const PswLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="psw_intro_1" options={{headerShown: false}}/>
      <Stack.Screen name="psw_intro_2" options={{headerShown: false}}/>
      <Stack.Screen name="psw_intro_3" options={{headerShown: false}}/>
    </Stack>
  )
}

export default PswLayout