import React from 'react'
import { Stack } from "expo-router"
import { Provider } from 'react-redux'
import { store } from '@/redux/store'

const RootLayout = () => {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="index" options={{headerShown:false}}/>
        <Stack.Screen name="(auth)" options={{headerShown:false}}/>
        <Stack.Screen name="(dashboard)" options={{headerShown:false}}/>
        <Stack.Screen name="(onboarding)" options={{headerShown:false, gestureEnabled: false}}/>
        <Stack.Screen name="(chat)" options={{headerShown:false}}/>
      </Stack>
      </Provider>
  )
}

export default RootLayout

