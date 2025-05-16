import { Stack } from "expo-router";
import React from "react";

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        animation: "slide_from_right",
      }}
    />
  );
}
