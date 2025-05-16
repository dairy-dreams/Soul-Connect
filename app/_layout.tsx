import { Stack } from "expo-router";
import React from "react";

const RootLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="(auth)"
    >
      <Stack.Screen 
        name="(auth)"
        options={{
          headerShown: false,
          gestureEnabled: false,
          animation: 'none'
        }}
      />
      <Stack.Screen 
        name="(app)"
        options={{
          headerShown: false,
          gestureEnabled: false,
          animation: 'fade'
        }}
      />
      <Stack.Screen 
        name="ChatScreen"
        options={{
          animation: 'slide_from_bottom',
          presentation: 'modal',
          gestureEnabled: true,
          gestureDirection: 'vertical',
          fullScreenGestureEnabled: true,
        }}
      />
    </Stack>
  );
};

export default RootLayout;
