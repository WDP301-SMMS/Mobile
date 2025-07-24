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
        name="index"
        options={{
          headerStyle: {
            backgroundColor: "#2260FF",
          },
          headerTintColor: "#fff",
          headerShown: true,
          headerTitle: "Lịch hẹn",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="detail/[id]"
        options={{
          headerStyle: {
            backgroundColor: "#2260FF",
          },
          headerTintColor: "#fff",
          headerShown: true,
          headerTitle: "Chi tiết lịch hẹn",
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
}
