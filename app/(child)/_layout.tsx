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
          backgroundColor: "#0288d1",
        },
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{
          title: "Học sinh",
          headerBackTitle: "Quay lại",
        }}
      />
    </Stack>
  );
}
