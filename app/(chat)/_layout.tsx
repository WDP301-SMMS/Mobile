import { Stack } from "expo-router";
import React from "react";

export default function StackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        headerTintColor: "#fff",
        headerStyle: {
          backgroundColor: "#2260FF",
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Tin nhắn của tôi" }} />
      <Stack.Screen name="[id]" options={{ title: "Tin nhắn" }} />
    </Stack>
  );
}
