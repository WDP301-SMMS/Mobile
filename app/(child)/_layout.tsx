// app/(child)/_layout.js
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
      <Stack.Screen
        name="detail/[id]"
        options={{
          title: "Học sinh",
        }}
      />
    </Stack>
  );
}
