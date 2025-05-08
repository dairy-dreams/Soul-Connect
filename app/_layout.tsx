import { Stack } from "expo-router";
import React from "react";

const RootLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "white" },
        animation: "slide_from_right",
        animationDuration: 300,
        presentation: "modal",
        headerStyle: {
          backgroundColor: "white",
        },
        headerTintColor: "black",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }} 
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="LoginScreen" />
      <Stack.Screen name="UsersChatList" />
      <Stack.Screen name="ChatScreen" />
    </Stack>
  );
};

export default RootLayout;
